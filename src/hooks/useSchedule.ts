"use client"

import { ScheduleEntry, ScheduleChanges } from "@/types"
import { createEmptyScheduleEntry } from "@/utils/schedule.utils"
import { validateAllSchedules, validateForSubmission } from "@/utils/schedule.validation"
import { useState, useCallback, useMemo } from "react"

export const useScheduleManager = (initialSchedules: ScheduleEntry[]) => {
  const [editableSchedule, setEditableSchedule] = useState<ScheduleEntry[]>(initialSchedules || [])
  const [originalSchedule, setOriginalSchedule] = useState<ScheduleEntry[]>(initialSchedules || [])
  const [scheduleChanges, setScheduleChanges] = useState<ScheduleChanges>({})
  const [isDirty, setIsDirty] = useState(false)

  // Lenient validation for real-time feedback (doesn't show errors for empty new entries)
  const validationErrors = useMemo(() => {
    const errors = validateAllSchedules(editableSchedule, scheduleChanges)
    // Filter out startTime and endTime related errors
    return errors.filter(
      (error) => !error.includes("start time") && !error.includes("end time")
    )
  }, [editableSchedule, scheduleChanges])

  // Strict validation for submission
  const getSubmissionErrors = useCallback(() => {
    const errors = validateForSubmission(editableSchedule, scheduleChanges)
    // Filter out startTime and endTime related errors
    return errors.filter(
      (error) => !error.includes("start time") && !error.includes("end time")
    )
  }, [editableSchedule, scheduleChanges])

  const resetSchedules = useCallback((schedules: ScheduleEntry[]) => {
    setEditableSchedule(schedules || [])
    setOriginalSchedule(schedules || [])
    setScheduleChanges({})
    setIsDirty(false)
  }, [])

  const trackFieldChange = useCallback(
    (entryId: string, field: keyof ScheduleEntry, newValue: any) => {
      const originalEntry = originalSchedule.find((entry) => entry._id === entryId)

      setScheduleChanges((prev: { [x: string]: any }) => {
        const entryChanges = { ...prev[entryId] }

        // If the new value is the same as original, remove the field from changes
        if (originalEntry && originalEntry[field] === newValue) {
          delete entryChanges[field]

          // If no changes left for this entry, remove the entry from changes
          if (Object.keys(entryChanges).length === 0) {
            const { [entryId]: removed, ...rest } = prev
            return rest
          }

          return { ...prev, [entryId]: entryChanges }
        }

        // Add or update the field change
        entryChanges[field] = newValue
        return { ...prev, [entryId]: entryChanges }
      })

      setIsDirty(
        Object.keys(scheduleChanges).length > 0 ||
          Object.keys({ ...scheduleChanges, [entryId]: { [field]: newValue } }).length > 0
      )
    },
    [originalSchedule, scheduleChanges]
  )

  const addEntry = useCallback(() => {
    setIsDirty(true)
    setEditableSchedule([...editableSchedule, createEmptyScheduleEntry()])
  }, [editableSchedule])

  const removeEntry = useCallback(
    (index: number) => {
      setEditableSchedule(editableSchedule.filter((_, i) => i !== index))
      setIsDirty(true)
    },
    [editableSchedule]
  )

  const updateEntry = useCallback(
    (index: number, updates: Partial<ScheduleEntry>) => {
      const newSchedule = [...editableSchedule]
      const entry = newSchedule[index]

      newSchedule[index] = { ...entry, ...updates }
      setEditableSchedule(newSchedule)

      if (entry._id) {
        // Track changes for existing entries
        Object.entries(updates).forEach(([field, value]) => {
          trackFieldChange(entry._id, field as keyof ScheduleEntry, value)
        })
      } else {
        setIsDirty(true)
      }
    },
    [editableSchedule, trackFieldChange]
  )

  // Check if there are any incomplete new entries
  const hasIncompleteEntries = useMemo(() => {
    return editableSchedule.some((entry) => {
      if (!entry._id) {
        // New entry - check if it's incomplete (exclude startTime and endTime)
        return !(
          entry.subjectId &&
          entry.classId &&
          entry.periodId &&
          entry.sectionId // Changed from entry.section to entry.sectionId for consistency
        )
      }
      return false
    })
  }, [editableSchedule])

  return {
    editableSchedule,
    scheduleChanges,
    isDirty,
    validationErrors,
    hasIncompleteEntries,
    getSubmissionErrors,
    resetSchedules,
    addEntry,
    removeEntry,
    updateEntry,
  }
}
"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ScheduleEntry {
  subject: string
  className: string
  section: string
  period: number
  subjectId: string
  classId: string
  sectionId: string
}

interface ScheduleModalProps {
  open: boolean
  onClose: () => void
  schedule: ScheduleEntry[]
  teacherId: string
  onSave: (updatedSchedule: ScheduleEntry[]) => void
  // These would come from your API or data source
  subjects?: []
  classes?: []
  sections?: string[]
}

export default function ScheduleModal({
  open,
  onClose,
  schedule,
  teacherId,
  onSave,
  subjects,classes,sections
}: ScheduleModalProps) {
  const [editableSchedule, setEditableSchedule] = useState<ScheduleEntry[]>([])

  useEffect(() => {
    setEditableSchedule(schedule || [])
  }, [schedule])

  const handleChange = (index: number, field: keyof ScheduleEntry, value: string | number) => {
    const newSchedule = [...editableSchedule]
    newSchedule[index] = { ...newSchedule[index], [field]: value }
    setEditableSchedule(newSchedule)
  }

  const handleAddEntry = () => {
    setEditableSchedule([
      ...editableSchedule,
      {
        subject: "",
        className: "",
        section: "",
        period: 1,
        subjectId: "",
        classId: "",
        sectionId: "",
      },
    ])
  }

  const handleRemoveEntry = (index: number) => {
    setEditableSchedule(editableSchedule.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    onSave(editableSchedule)
    onClose()
  }

  const handleSelectSubject = (index: number, subjectId: string, subjectName: string) => {
    const newSchedule = [...editableSchedule]
    newSchedule[index] = {
      ...newSchedule[index],
      subjectId,
      subject: subjectName,
    }
    setEditableSchedule(newSchedule)
  }

  const handleSelectClass = (index: number, classId: string, className: string) => {
    const newSchedule = [...editableSchedule]
    newSchedule[index] = {
      ...newSchedule[index],
      classId,
      className,
    }
    setEditableSchedule(newSchedule)
  }

  const handleSelectSection = (index: number, sectionName: string) => {
    const newSchedule = [...editableSchedule]
    newSchedule[index] = {
      ...newSchedule[index],
      section: sectionName,
    }
    setEditableSchedule(newSchedule)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Schedule</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-1 py-2 bg-muted/50 rounded-md font-medium text-sm">
            <div className="col-span-3">Subject</div>
            <div className="col-span-3">Class</div>
            <div className="col-span-3">Section</div>
            <div className="col-span-2">Period</div>
            <div className="col-span-1"></div>
          </div>

          <ScrollArea className="flex-1 max-h-[50vh] pr-4">
            <div className="flex flex-col gap-3">
              {editableSchedule.map((entry, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3">
                    <SubjectDropdown
                      value={entry.subjectId}
                      displayValue={entry.subject}
                      subjects={subjects as any}
                      onChange={(id, name) => handleSelectSubject(i, id, name)}
                    />
                  </div>
                  <div className="col-span-3">
                    <ClassDropdown
                      value={entry.classId}
                      displayValue={entry.className}
                      classes={classes as any}
                      onChange={(id, name) => handleSelectClass(i, id, name)}
                    />
                  </div>
                  <div className="col-span-3">
                    <SectionDropdown
                      value={entry.section}
                      displayValue={entry.section}
                      sections={sections as string[]}
                      onChange={(name) => handleSelectSection(i, name)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="Period"
                      value={entry.period || ""}
                      onChange={(e) => handleChange(i, "period", Number(e.target.value))}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEntry(i)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Button onClick={handleAddEntry} variant="outline" className="flex items-center gap-2 w-full">
            <Plus className="h-4 w-4" />
            Add Schedule Entry
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DropdownProps {
  value: string
  displayValue: string
  onChange: (id: string, name: string) => void
  placeholder?: string
}

function SubjectDropdown({
  value,
  displayValue,
  subjects,
  onChange,
  placeholder = "Select subject",
}: DropdownProps & { subjects: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search subject..." />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {subjects.map((subject: any) => (
                <CommandItem
                  key={subject._id}
                  value={subject.name}
                  onSelect={() => {
                    onChange(subject._id, subject.name)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === subject._id ? "opacity-100" : "opacity-0")} />
                  {subject.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function ClassDropdown({
  value,
  displayValue,
  classes,
  onChange,
  placeholder = "Select class",
}: DropdownProps & { classes: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search class..." />
          <CommandList>
            <CommandEmpty>No class found.</CommandEmpty>
            <CommandGroup>
              {classes.map((cls) => (
                <CommandItem
                  key={cls.id}
                  value={cls.name}
                  onSelect={() => {
                    onChange(cls.id, cls.name)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === cls.id ? "opacity-100" : "opacity-0")} />
                  {cls.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function SectionDropdown({
  value,
  displayValue,
  sections,
  onChange,
  placeholder = "Select section",
}: {
  value: string
  displayValue: string
  sections: string[]
  onChange: (name: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search section..." />
          <CommandList>
            <CommandEmpty>No section found.</CommandEmpty>
            <CommandGroup>
              {Array.isArray(sections) &&
                sections.map((section, index) => (
                  <CommandItem
                    key={index}
                    value={section}
                    onSelect={() => {
                      onChange(section)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === section ? "opacity-100" : "opacity-0")} />
                    {section}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Subject } from "@/types"

interface EditSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Subject | null
  handleEdit: (data: Subject, isEdit: boolean) => void
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({
  isOpen,
  onClose,
  initialData,
  handleEdit,
}) => {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)

  const isEdit = Boolean(initialData?._id)

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || "")
      setCode(initialData?.code || "")
      setDescription(initialData?.description || "")
      setError(null)
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    if (name.trim().length < 2) {
      setError("Subject name must be at least 2 characters.")
      return
    }

    const payload = {
      ...(isEdit && { _id: initialData?._id }), // Include _id only when editing
      name: name.trim(),
      code: code.trim(),
      description: description.trim(),
    } as Subject

    handleEdit(payload, true)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {isEdit ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* Subject Name */}
          <div className="space-y-1">
            <Label htmlFor="subject-name" className="text-gray-700">
              Subject Name
            </Label>
            <Input
              id="subject-name"
              placeholder="Enter subject name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Subject Code */}
          <div className="space-y-1">
            <Label htmlFor="subject-code" className="text-gray-700">
              Subject Code
            </Label>
            <Input
              id="subject-code"
              placeholder="Enter subject code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(null)
              }}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label htmlFor="subject-description" className="text-gray-700">
              Description
            </Label>
            <Input
              id="subject-description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setError(null)
              }}
              className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg px-4 py-2 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition-colors duration-200"
          >
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditSubjectModal

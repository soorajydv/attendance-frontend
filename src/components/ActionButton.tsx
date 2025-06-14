"use client"

import { useState } from "react"
import { Pencil, X, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ActionButtonsProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

export default function ActionButtons({ 
  onView, 
  onEdit, 
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true
}: ActionButtonsProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const handleDelete = () => {
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    onDelete?.()
    setDeleteConfirmOpen(false)
  }

  return (
    <>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {showView && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 p-0 min-w-0 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl border-0"
                  onClick={onView}
                >
                  <Eye className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Details</p>
              </TooltipContent>
            </Tooltip>
          )}

          {showEdit && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 p-0 min-w-0 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl border-0"
                  onClick={onEdit}
                >
                  <Pencil className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          )}

          {showDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 p-0 min-w-0 hover:scale-110 transition-all duration-200 shadow-lg hover:shadow-xl border-0"
                  onClick={handleDelete}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md border-0 shadow-2xl">
          <div className="p-6 flex flex-col gap-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Record</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this record? This action cannot be undone and all data will be permanently removed.
              </p>
            </div>
            <div className="flex gap-4 justify-center mt-6">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="px-6">
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={confirmDelete}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

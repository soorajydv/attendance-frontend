"use client"

import type React from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createPeriod, updatePeriod } from "@/store/slices/periodSlice"
import type { Period } from "@/store/slices/periodSlice"
import { useToast } from "./providers/ToastProvider"

interface PeriodModalProps {
  open: boolean
  onClose: () => void
  mode: "create" | "edit"
  initialData?: Period | null
}

const PeriodModal: React.FC<PeriodModalProps> = ({ open, onClose, mode, initialData }) => {
  const dispatch = useAppDispatch()

  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Period>({
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
    },
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData)
    } else {
      reset({ name: "", startTime: "", endTime: "" })
    }
  }, [initialData, mode, reset])

  const onSubmit = async (data: Period) => {
    try {
      if (mode === "create") {
        await dispatch(createPeriod(data)).unwrap()
      } else if (mode === "edit" && initialData?._id) {
        await dispatch(updatePeriod({ id: initialData._id, data })).unwrap()
      }
      onClose()
    } catch (error) {
      toast.current.show({severity:"error", detail:`${error}`})
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Period" : "Edit Period"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Period Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Period name is required" })}
              placeholder="Enter period name (e.g., Period 1, Morning Session)"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" {...register("startTime", { required: "Start time is required" })} />
              {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" {...register("endTime", { required: "End time is required" })} />
              {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={mode === "create" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Period" : "Update Period"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PeriodModal

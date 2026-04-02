import { Modal } from "@/components/ui/Modal"

interface DeleteConfirmModalProps {
  bookmarkTitle: string | null
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  bookmarkTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={bookmarkTitle !== null}
      onClose={onCancel}
      title="Delete bookmark"
      titleId="delete-modal-title"
    >
      <p className="mb-6 text-sm text-ink-sub">
        Are you sure you want to permanently delete{" "}
        <span className="font-semibold text-ink">{bookmarkTitle}</span>? This
        action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink-sub transition-colors hover:bg-surface-alt focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-lg bg-danger-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger-800 focus-visible:ring-2 focus-visible:ring-danger-600 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Delete permanently
        </button>
      </div>
    </Modal>
  )
}

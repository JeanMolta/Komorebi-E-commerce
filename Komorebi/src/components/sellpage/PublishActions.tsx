import React from 'react'

interface PublishActionsProps {
  isSubmitting: boolean
  isDraft: boolean
  onSaveAsDraft: (e: React.MouseEvent) => void
  onPublish: (e: React.FormEvent) => void
}

const PublishActions: React.FC<PublishActionsProps> = ({
  isSubmitting,
  isDraft,
  onSaveAsDraft,
  onPublish
}) => {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={onSaveAsDraft}
        disabled={isSubmitting}
        className={`flex-1 py-4 rounded-4xl font-semibold transition-all ${
          isSubmitting && isDraft
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-200 text-[var(--komorebi-black)] hover:bg-gray-300'
        }`}
      >
        {isSubmitting && isDraft ? 'Saving...' : 'Cancel'}
      </button>
      
      <button
        type="submit"
        onClick={onPublish}
        disabled={isSubmitting}
        className={`flex-1 py-4 rounded-4xl font-semibold transition-all ${
          isSubmitting && !isDraft
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'btn-komorebi-yellow'
        }`}
      >
        {isSubmitting && !isDraft ? 'Publishing...' : 'Publish Product'}
      </button>
    </div>
  )
}

export default PublishActions
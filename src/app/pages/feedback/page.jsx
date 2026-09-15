import React from 'react'
import BackButton from '@/app/components/BackButton'
import FeedbackCard from '@/app/components/Feedback/FeedbackCard'

const feedback = () => {
  return (

    <div className="page-shell">
      <div className="page-header">
        <div className="flex min-w-0 items-center gap-2">
          <BackButton />
          <h1 className="page-title">
            Feedbacks
          </h1>
        </div>
      </div>
      <FeedbackCard />
    </div>
  )
}

export default feedback
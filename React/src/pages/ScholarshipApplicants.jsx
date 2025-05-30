import React, { useEffect } from 'react'
import { useState } from 'react';

const ScholarshipApplicants = ({scholarshipId, onBack}) => {
    return (
        <div>
            <p>Scholarship ID: {scholarshipId}</p>
            <button onClick={onBack} className='border p-3 hover:cursor-pointer hover:bg-gray-600'>Back</button>
        </div>
    )
}

export default ScholarshipApplicants
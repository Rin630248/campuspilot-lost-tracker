import { useState } from 'react'
import StudentView from './StudentView'
import AdminView from './AdminView'
import './lostfound.css'

export default function LostFoundContent() {
  const [activeTab, setActiveTab] = useState('student')

  return (
    <div className="campuspilot-lostfound">

      {/* Student / Admin tabs */}
      <div className="lostfound-tabs">
        <button
          type="button"
          className={`lostfound-tab ${
            activeTab === 'student' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('student')}
        >
          Student
        </button>

        <button
          type="button"
          className={`lostfound-tab ${
            activeTab === 'admin' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('admin')}
        >
          Admin
        </button>
      </div>

      {/* Content shown inside the same CampusPilot area */}
      <div className="lostfound-tab-content">
        {activeTab === 'student' ? <StudentView /> : <AdminView />}
      </div>

    </div>
  )
}
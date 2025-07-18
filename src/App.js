import React, { useState, useEffect } from 'react';

const App = () => {
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Note: JSONBin.io is used here as a simple external data store for a global counter.
    // For a production application, consider a more robust backend solution.
    const BIN_ID = '6697b0a8e41b4d34e40e0269'; // Your JSONBin.io Bin ID
    const API_KEY = '$2a$10$2BN7neEOals6UvYTgKcxweNg2inLhpsNfE4XPUYBYK1wJ58Tbx0Bi'; // Your JSONBin.io Master Key

    const fetchAndIncrementVisits = async () => {
      try {
        // Fetch current visit count
        const response = await fetch(`https://api.jsonbin.io/v3/b/6879f5c465989d0173c85bcd`, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });
        const data = await response.json();
        const currentVisits = data.record.visits || 0; // Access 'record.visits' as per JSONBin.io structure

        // Increment and update the count
        const newVisits = currentVisits + 1;
        await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({ visits: newVisits })
        });

        setVisitorCount(newVisits);
      } catch (err) {
        console.error("Error updating global visits:", err);
        // Fallback to local storage if global counter fails
        let localVisits = parseInt(localStorage.getItem('gpaCalculatorVisits')) || 0;
        localVisits += 1;
        localStorage.setItem('gpaCalculatorVisits', localVisits.toString());
        setVisitorCount(localVisits);
        setErrorMessage('Global counter failed. Showing local visits only.');
      }
    };

    fetchAndIncrementVisits();
    setCourses([{ id: Date.now(), name: '', gpa: '', credits: '' }]);
  }, []);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', gpa: '', credits: '' }]);
    setErrorMessage('');
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    setCalculatedGpa(null);
    setErrorMessage('');
  };

  const handleCourseChange = (id, field, value) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
    setCalculatedGpa(null);
    setErrorMessage('');
  };

  const calculateGpa = () => {
    let totalQualityPoints = 0;
    let totalCreditHours = 0;
    let hasError = false;

    for (const course of courses) {
      const gpa = parseFloat(course.gpa);
      const credits = parseFloat(course.credits);

      if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
        setErrorMessage('Please enter a valid GPA between 0.0 and 4.0 for all courses.');
        hasError = true;
        break;
      }
      if (isNaN(credits) || credits <= 0) {
        setErrorMessage('Please enter valid credit hours (greater than 0) for all courses.');
        hasError = true;
        break;
      }

      totalQualityPoints += gpa * credits;
      totalCreditHours += credits;
    }

    if (hasError) {
      setCalculatedGpa(null);
      return;
    }

    if (totalCreditHours === 0) {
      setErrorMessage('Total credit hours cannot be zero. Please add at least one course with credit hours.');
      setCalculatedGpa(null);
      return;
    }

    const finalGpa = (totalQualityPoints / totalCreditHours).toFixed(2);
    setCalculatedGpa(finalGpa);
    setErrorMessage('');
  };

  return (
    <div className="app-container">
      {/* Embedded CSS for styling */}
      <style>{`
        /* Basic Reset & Font */
        body {
          margin: 0;
          font-family: 'Inter', sans-serif; /* Using Inter as per instructions, fallback to sans-serif */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background-color: #f0f2f5; /* Light background for consistency */
        }

        /* Main App Container */
        .app-container {
          min-height: 100vh;
          background: linear-gradient(to bottom right, #3b82f6, #9333ea); /* Blue to Purple gradient */
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box; /* Include padding in element's total width and height */
        }

        /* GPA Calculator Card */
        .gpa-calculator-card {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 1rem; /* Rounded corners */
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* Shadow */
          width: 100%;
          max-width: 48rem; /* Max width for larger screens */
          transform: scale(1);
          transition: transform 0.3s ease-in-out; /* Hover effect */
        }

        .gpa-calculator-card:hover {
          transform: scale(1.01);
        }

        /* App Title */
        .app-title {
          font-size: 2.25rem; /* 4xl */
          font-weight: 800; /* Extrabold */
          color: #1f2937; /* Gray-800 */
          margin-bottom: 2rem;
          text-align: center;
        }

        .app-title span {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(to right, #2563eb, #7c3aed); /* Blue-600 to Purple-700 */
        }

        /* Visitor Counter */
        .visitor-counter {
          text-align: center;
          color: #4b5563; /* Gray-600 */
          margin-bottom: 1.5rem;
        }

        .visitor-counter p {
          font-size: 1.125rem; /* lg */
          font-weight: 500; /* Medium */
          margin: 0;
        }

        .visitor-counter span {
          color: #1d4ed8; /* Blue-700 */
          font-weight: 800; /* Extrabold */
        }

        .visitor-note {
          font-size: 0.75rem; /* xs */
          color: #6b7280; /* Gray-500 */
          margin-top: 0.25rem;
        }

        /* Course Input Section */
        .course-input-section {
          display: flex;
          flex-direction: column; /* Stack vertically on small screens */
          gap: 1.5rem; /* space-y-6 */
          margin-bottom: 2rem;
        }

        .course-row {
          display: flex;
          flex-direction: column; /* Stack vertically on small screens */
          align-items: center;
          gap: 1rem; /* gap-4 */
          background-color: #f9fafb; /* Gray-50 */
          padding: 1rem;
          border-radius: 0.5rem; /* Rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* Shadow-md */
          transition: all 0.3s ease-in-out; /* Hover effect */
        }

        .course-row:hover {
          background-color: #f3f4f6; /* Gray-100 */
        }

        .course-name-input,
        .gpa-input,
        .credits-input {
          flex: 1; /* flex-1 */
          padding: 0.75rem; /* p-3 */
          border: 1px solid #d1d5db; /* Border-gray-300 */
          border-radius: 0.375rem; /* Rounded-md */
          transition: all 0.2s ease; /* Transition duration-200 */
          width: 100%; /* Full width on small screens */
          box-sizing: border-box; /* Include padding in element's total width and height */
        }

        .gpa-input {
          max-width: 8rem; /* sm:w-32 */
        }

        .credits-input {
          max-width: 7rem; /* sm:w-28 */
        }

        .course-name-input:focus,
        .gpa-input:focus,
        .credits-input:focus {
          outline: none;
          border-color: transparent;
          box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.5); /* focus:ring-2 focus:ring-blue-400 */
        }

        /* Remove Button */
        .remove-button {
          background-color: #ef4444; /* Red-500 */
          color: #ffffff;
          padding: 0.75rem; /* p-3 */
          border-radius: 0.375rem; /* Rounded-md */
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease; /* Hover & transition */
          width: 100%; /* Full width on small screens */
          box-sizing: border-box;
          display: flex; /* Use flex to center SVG */
          justify-content: center;
          align-items: center;
        }

        .remove-button:hover {
          background-color: #dc2626; /* Red-600 */
        }

        .remove-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.75); /* focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 */
        }

        .remove-button svg {
          height: 1.25rem; /* h-5 */
          width: 1.25rem; /* w-5 */
          /* margin: 0 auto; Removed as flex handles centering */
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          flex-direction: column; /* Stack vertically on small screens */
          gap: 1rem; /* gap-4 */
          margin-bottom: 1.5rem;
        }

        .add-course-button,
        .calculate-gpa-button {
          flex: 1; /* flex-1 */
          padding: 1rem; /* p-4 */
          border-radius: 0.375rem; /* Rounded-md */
          font-weight: 600; /* Font-semibold */
          font-size: 1.125rem; /* Text-lg */
          color: #ffffff;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.2s ease; /* Hover & transition */
          box-sizing: border-box;
        }

        .add-course-button {
          background-color: #22c55e; /* Green-500 */
        }

        .add-course-button:hover {
          background-color: #16a34a; /* Green-600 */
          transform: scale(1.05);
        }

        .add-course-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.75); /* focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 */
        }

        .calculate-gpa-button {
          background-color: #2563eb; /* Blue-600 */
        }

        .calculate-gpa-button:hover {
          background-color: #1d4ed8; /* Blue-700 */
          transform: scale(1.05);
        }

        .calculate-gpa-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.75); /* focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 */
        }

        /* Error Message */
        .error-message {
          background-color: #fee2e2; /* Red-100 */
          border: 1px solid #ef4444; /* Border-red-400 */
          color: #b91c1c; /* Text-red-700 */
          padding: 1rem;
          border-radius: 0.375rem; /* Rounded-md */
          position: relative;
          margin-bottom: 1.5rem;
        }

        .error-message strong {
          font-weight: 700; /* Font-bold */
        }

        .error-message span {
          display: block; /* block */
          margin-left: 0.5rem; /* ml-2 */
        }

        /* Result Display */
        .gpa-result {
          background-color: #eff6ff; /* Blue-50 */
          padding: 1.5rem;
          border-radius: 0.5rem; /* Rounded-lg */
          text-align: center;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06); /* Shadow-inner */
        }

        .gpa-result p {
          font-size: 1.5rem; /* Text-2xl */
          color: #4b5563; /* Gray-700 */
          font-weight: 500; /* Font-medium */
          margin: 0;
        }

        .calculated-gpa-value {
          font-size: 3rem; /* Text-5xl */
          font-weight: 800; /* Font-extrabold */
          color: #1d4ed8; /* Blue-700 */
          margin-top: 0.5rem;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* Animate-pulse */
        }

        /* Keyframes for pulse animation */
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }

        /* Responsive Adjustments */
        @media (min-width: 640px) { /* Equivalent to sm: breakpoint in Tailwind */
          .course-row {
            flex-direction: row; /* Align horizontally on larger screens */
          }

          .course-name-input {
            flex: 1; /* Take up remaining space */
          }

          .gpa-input {
            width: 8rem; /* Specific width */
          }

          .credits-input {
            width: 7rem; /* Specific width */
          }

          .remove-button {
            width: auto; /* Auto width */
          }

          .action-buttons {
            flex-direction: row; /* Align horizontally on larger screens */
          }

          .error-message span {
            display: inline; /* Inline on larger screens */
          }
        }
      `}</style>

      <div className="gpa-calculator-card">
        <h1 className="app-title">
          <span>GPA Calculator</span>
        </h1>

        {/* Visitor Counter Display */}
        <div className="visitor-counter">
          <p>Total Visits: <span>{visitorCount}</span></p>
          <p className="visitor-note">(This is the total number of visits across all users.)</p>
        </div>

        {/* Course Input Section */}
        <div className="course-input-section">
          {courses.map((course) => (
            <div key={course.id} className="course-row">
              <input
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                className="course-name-input"
              />
              <input
                type="number"
                placeholder="GPA (0.0-4.0)"
                value={course.gpa}
                onChange={(e) => handleCourseChange(course.id, 'gpa', e.target.value)}
                className="gpa-input"
              />
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
                className="credits-input"
              />
              {courses.length > 1 && (
                <button className="remove-button" onClick={() => removeCourse(course.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="add-course-button" onClick={addCourse}>Add Course</button>
          <button className="calculate-gpa-button" onClick={calculateGpa}>Calculate GPA</button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message">
            <strong>Error: </strong><span>{errorMessage}</span>
          </div>
        )}

        {/* GPA Result */}
        {calculatedGpa !== null && !errorMessage && (
          <div className="gpa-result">
            <p>Your Calculated GPA:</p>
            <p className="calculated-gpa-value">{calculatedGpa}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

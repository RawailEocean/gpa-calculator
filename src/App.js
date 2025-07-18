import React, { useState, useEffect } from 'react';

// Main App component
const App = () => {
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const BIN_ID = 6879f5c465989d0173c85bcd; // <-- Replace this
    const API_KEY = $2a$10$2BN7neEOals6UvYTgKcxweNg2inLhpsNfE4XPUYBYK1wJ58Tbx0Bi; // <-- Replace this
    const BIN_URL = https://api.jsonbin.io/v3/b/6879f5c465989d0173c85bcd;

    const fetchAndIncrementVisits = async () => {
      try {
        // Fetch current count
        const res = await fetch(BIN_URL, {
          headers: {
            'X-Master-Key': API_KEY
          }
        });
        const data = await res.json();
        const currentVisits = data.record.visits;

        // Increment and update
        await fetch(BIN_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
          },
          body: JSON.stringify({ visits: currentVisits + 1 })
        });

        setVisitorCount(currentVisits + 1);
      } catch (err) {
        console.error("Error updating visits:", err);
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
      <style>{`
        /* [Your previous embedded CSS here, unchanged] */
      `}</style>

      <div className="gpa-calculator-card">
        <h1 className="app-title">
          <span>GPA Calculator</span>
        </h1>

        {/* Visitor Counter Display */}
        <div className="visitor-counter">
          <p>
            Total Visits: <span>{visitorCount}</span>
          </p>
          <p className="visitor-note">
            (This is the total number of visits across all users.)
          </p>
        </div>

        {/* Course Input Section */}
        <div className="course-input-section">
          {courses.map((course, index) => (
            <div key={course.id} className="course-row">
              <input
                type="text"
                placeholder="Course Name (Optional)"
                value={course.name}
                onChange={(e) => handleCourseChange(course.id, 'name', e.target.value)}
                className="course-name-input"
              />
              <input
                type="number"
                placeholder="GPA (0.0-4.0)"
                value={course.gpa}
                onChange={(e) => handleCourseChange(course.id, 'gpa', e.target.value)}
                min="0.0"
                max="4.0"
                step="0.01"
                className="gpa-input"
              />
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => handleCourseChange(course.id, 'credits', e.target.value)}
                min="0.5"
                step="0.5"
                className="credits-input"
              />
              {courses.length > 1 && (
                <button
                  onClick={() => removeCourse(course.id)}
                  className="remove-button"
                  title="Remove Course"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={addCourse} className="add-course-button">
            Add Course
          </button>
          <button onClick={calculateGpa} className="calculate-gpa-button">
            Calculate GPA
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message">
            <strong>Error:</strong> <span>{errorMessage}</span>
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

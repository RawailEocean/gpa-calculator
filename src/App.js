import React, { useState, useEffect } from 'react';

const App = () => {
  const [courses, setCourses] = useState([]);
  const [calculatedGpa, setCalculatedGpa] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
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
      <div className="gpa-calculator-card">
        <h1 className="app-title">
          <span>GPA Calculator</span>
        </h1>

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
                <button className="remove-button" onClick={() => removeCourse(course.id)}>❌</button>
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

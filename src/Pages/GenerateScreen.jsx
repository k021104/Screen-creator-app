import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

function ScreenGenerate () {
  const location = useLocation()
  const navigate = useNavigate()

  const [screens, setScreens] = useState(location.state?.screens || [])

  const [currentStep, setCurrentStep] = useState(1)

  const currentScreen = screens[currentStep - 1]

  const [formData, setFormData] = useState({})

  const [errors, setErrors] = useState({})

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Next Button
  const handleNext = () => {
    const isValid = validateScreen()

    if (!isValid) {
      return
    }

    if (currentStep < screens.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Previous Button
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Cancel Button
  const handleCancel = () => {
    const updatedScreens = screens.filter(
      (_, index) => index !== currentStep - 1
    )

    setScreens(updatedScreens)

    if (updatedScreens.length === 0) {
      navigate('/')
      return
    }

    // location.state.screens = updatedScreens

    if (currentStep > updatedScreens.length) {
      setCurrentStep(updatedScreens.length)
    }
  }

  // const handleFinish = () => {
  //   console.log('Final Form Data:', formData)

  //   alert('Form Submitted Successfully')
  // }

  const handleFinish = () => {
    const isValid = validateScreen()

    if (!isValid) return

    const finalOutput = screens.map(screen => ({
      screenName: screen.screenName,

      fields: screen.fields.map(field => ({
        id: field.fieldId || field.id,

        name: field.fieldName,

        label: field.fieldLabel,

        type: field.type,

        maxLength: field.maxLength,

        value: formData[field.fieldName] || '',

        options: field.options || []
      }))
    }))

    console.log(finalOutput)
    // console.log(JSON.stringify(finalOutput, null, 2))

    alert('Form Submitted Successfully')
  }

  const handleCheckboxChange = (fieldName, optionValue, checked) => {
    let updatedValues = formData[fieldName] || []

    if (checked) {
      updatedValues = [...updatedValues, optionValue]
    } else {
      updatedValues = updatedValues.filter(item => item !== optionValue)
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: updatedValues
    }))
  }

  const validateScreen = () => {
    let newerrors = {}

    currentScreen.fields.forEach(field => {
      const value = formData[field.fieldName]

      //Required validation
      if (value === undefined || value === null || value === '') {
        newerrors[field.fieldName] = `${field.fieldLabel} is required`
      }

      //email validation
      if (
        field.type === 'email' &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        newerrors[field.fieldName] = 'Invalid email format'
      }

      //phone validation
      if (field.type === 'phone' && value && value.length != 10) {
        newerrors[field.fieldName] = 'Phone number must be 10 digits'
      }

      //Max Length Validation
      if (field.maxLength && value && value.length > field.maxLength) {
        newerrors[
          field.fieldName
        ] = `Maximum ${field.maxLength} characters allowed`
      }

      //Date Validations
     if (field.type === 'date') {
  const selectedDate = new Date(formData[field.fieldName])
  const minDate = new Date(field.minDate)
  const maxDate = new Date(field.maxDate)

  if (!formData[field.fieldName]) {
    newerrors[field.fieldName] =
      `${field.fieldLabel} is required`
  } else if (
    selectedDate < minDate ||
    selectedDate > maxDate
  ) {
    newerrors[field.fieldName] =
      `${field.fieldLabel} must be between ${field.minDate} and ${field.maxDate}`
  }
}

      //number validation
      if (field.type === 'number') {
        if (field.minValue && Number(value) < Number(field.minValue)) {
          newerrors[field.fieldName] = `Minimum age is ${field.minValue}`
        }

        if (field.maxValue && Number(value) > Number(field.maxValue)) {
          newerrors[field.fieldName] = `Maximum age is ${field.maxValue}`
        }
      }

      //checkbox validation
      if (field.type === 'checkbox' && (!value || value.length === 0)) {
        newerrors[field.fieldName] = `Select at least one option`
      }

      //radio validation
      if (field.type === 'radio' && !value) {
        newerrors[field.fieldName] = `Please select ${field.fieldLabel}`
      }

      //dropdown validation
      if (field.type === 'select dropdown' && !value) {
        newerrors[field.fieldName] = `Please select ${field.fieldLabel}`
      }
    })

    setErrors(newerrors)

    return Object.keys(newerrors).length === 0
  }

  return (
    <div className='min-vh-100 d-flex align-items-center bg-light'>
      <Container>
        <Row className='justify-content-center'>
          <Col md={10}>
            <Card className='shadow-lg border-0 rounded-4 p-4'>
              {/* Heading */}
              <div className='text-center mb-4'>
                <h2 className='fw-bold text-primary'>
                  {currentScreen?.screenName}
                </h2>

                <p className='text-muted'>
                  Screen {currentStep} of {screens.length}
                </p>
              </div>

              {/* Dynamic Fields */}
              <Form>
                <Row>
                  {currentScreen?.fields.map(field => (
                    <Col md={12} key={field.id} className='mb-4'>
                      <Form.Group>
                        <Form.Label className='fw-semibold'>
                          {field.fieldLabel}
                        </Form.Label>

                        {(field.type === 'text' ||
                          field.type === 'email' ||
                          field.type === 'password' ||
                          field.type === 'phone') && (
                          <Form.Group>
                            <Form.Control
                              type={field.type}
                              placeholder={`Enter ${field.fieldLabel}`}
                              maxLength={field.maxLength}
                              value={formData[field.fieldName || '']}
                              onChange={e => {
                                handleInputChange(
                                  field.fieldName,
                                  e.target.value
                                )
                              }}
                              isInvalid={!!errors[field.fieldName]}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors[field.fieldName]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        {field.type === 'number' && (
                          <Form.Group>
                            <Form.Control
                              type='number'
                              min={field.minValue}
                              max={field.maxValue}
                              placeholder={`Enter ${field.fieldLabel}`}
                              value={formData[field.fieldName] || ''}
                              onChange={e =>
                                handleInputChange(
                                  field.fieldName,
                                  e.target.value
                                )
                              }
                              isInvalid={!!errors[field.fieldName]}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors[field.fieldName]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        {field.type === 'textarea' && (
                          <Form.Group>
                            <Form.Control
                              as='textarea'
                              rows={4}
                              placeholder={`Enter ${field.fieldLabel}`}
                              value={formData[field.fieldName] || ''}
                              onChange={e =>
                                handleInputChange(
                                  field.fieldName,
                                  e.target.value
                                )
                              }
                              isInvalid={!!errors[field.fieldName]}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors[field.fieldName]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        {field.type === 'select dropdown' && (
                          <Form.Group>
                            <Form.Select
                              value={formData[field.fieldName] || ''}
                              onChange={e =>
                                handleInputChange(
                                  field.fieldName,
                                  e.target.value
                                )
                              }
                              isInvalid={!!errors[field.fieldName]}
                            >
                              <option value=''>
                                Select {field.fieldLabel}
                              </option>

                              {field.options?.map((option, index) => (
                                <option key={index} value={option.optionValue}>
                                  {option.optionLabel}
                                </option>
                              ))}
                            </Form.Select>

                            <Form.Control.Feedback type='invalid'>
                              {errors[field.fieldName]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}

                        {field.type === 'radio' && (
                          <div>
                            {field.options?.map((option, index) => (
                              <Form.Group>
                                <Form.Check
                                  key={index}
                                  type='radio'
                                  label={option.optionLabel}
                                  name={field.fieldName}
                                  value={option.optionValue}
                                  checked={
                                    formData[field.fieldName] ===
                                    option.optionValue
                                  }
                                  onChange={e =>
                                    handleInputChange(
                                      field.fieldName,
                                      e.target.value
                                    )
                                  }
                                  className='mb-2'
                                />
                                {errors[field.fieldName] && (
                                  <div className='text-danger small mt-1'>
                                    {errors[field.fieldName]}
                                  </div>
                                )}
                              </Form.Group>
                            ))}
                          </div>
                        )}

                        {field.type === 'checkbox' && (
                          <div>
                            {field.options.map((option, index) => (
                              <Form.Group>
                                <Form.Check
                                  key={index}
                                  type='checkbox'
                                  label={option.optionLabel}
                                  value={option.optionValue}
                                  checked={
                                    formData[field.fieldName]?.includes(
                                      option.optionValue
                                    ) || false
                                  }
                                  onChange={e =>
                                    handleCheckboxChange(
                                      field.fieldName,
                                      option.optionValue,
                                      e.target.checked
                                    )
                                  }
                                  className='mb-2'
                                />
                                {errors[field.fieldName] && (
                                  <div className='text-danger small mt-1'>
                                    {errors[field.fieldName]}
                                  </div>
                                )}
                              </Form.Group>
                            ))}
                          </div>
                        )}

                        {field.type === 'date' && (
                          <Form.Group>
                            <Form.Control
                              type='date'
                              name={field.fieldName}
                              value={formData[field.fieldName] || ''}
                              // min={field.minDate}
                              // max={field.maxDate}
                              onChange={e =>
                                handleInputChange(
                                  field.fieldName,
                                  e.target.value
                                )
                              }
                              isInvalid={!!errors[field.fieldName]}
                            />
                            <Form.Control.Feedback type='invalid'>
                              {errors[field.fieldName]}
                            </Form.Control.Feedback>
                          </Form.Group>
                        )}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </Form>

              {/* Buttons */}
              <div className='d-flex gap-3 mt-4'>
                {/* Previous */}
                <Button
                  className='w-50 py-2 rounded-3 fw-semibold'
                  variant='secondary'
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {/* Cancel */}
                <Button 
                  className='w-50 py-2 rounded-3 fw-semibold'
                  variant='danger' onClick={handleCancel}>
                  Cancel
                </Button>

                {/* Next/Finish */}
                {currentStep === screens.length ? (
                  <Button 
                    className='w-50 py-2 rounded-3 fw-semibold'
                    variant='success' onClick={handleFinish}>
                    Finish
                  </Button>
                ) : (
                  <Button 
                    className='w-50 py-2 rounded-3 fw-semibold'
                    variant='primary' onClick={handleNext}>
                    Next
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ScreenGenerate

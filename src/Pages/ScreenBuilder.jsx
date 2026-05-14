import React, { useEffect, useState } from 'react'

import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

import { useLocation } from 'react-router-dom'

function ScreenBuilder () {
  const [currentStep, setCurrentStep] = useState(1)
  const [fieldType, setFieldType] = useState('')
  // const [fields, setFields] = useState([])
  const [screens, setScreens] = useState([])
  const [fieldError, setFieldError] = useState('')
  // const [options, setOptions] = useState([])
  const location = useLocation('')
  const navigate = useNavigate()

  const totalScreens = location.state?.totalScreens

  const currentScreen = screens[currentStep - 1]

  useEffect(() => {
    const allScreens = []

    for (let i = 1; i <= totalScreens; i++) {
      allScreens.push({
        screenNo: i,
        screenName: '',
        fields: []
      })
    }

    setScreens(allScreens)
  }, [totalScreens])

  const handleNext = () => {
    const isValid = validateFields()

    if (!isValid) {
      return
    }

    if (currentStep < totalScreens) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddFields = () => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      options: [],
      fieldId: '',
      fieldName: '',
      fieldLabel: '',
      maxLength: fieldType === 'phone' ? 10 : '',
      minValue: '',
      maxValue: '',
      minDate: '',
  maxDate: ''
    }

    const updatedScreens = screens.map(screen => {
      if (screen.screenNo === currentStep) {
        return {
          ...screen,
          fields: [...screen.fields, newField]
        }
      }

      return screen
    })

    setScreens(updatedScreens)
    setFieldType('')
  }

  const handleFieldChange = (fieldId, key, value) => {
    const updatedScreens = screens.map(screen => {
      // Current screen find karo
      if (screen.screenNo === currentStep) {
        const updatedFields = screen.fields.map(field => {
          // Exact field find karo
          if (field.id === fieldId) {
            // Property update karo
            return {
              ...field,
              [key]: value
            }
          }

          return field
        })

        return {
          ...screen,
          fields: updatedFields
        }
      }

      return screen
    })

    setScreens(updatedScreens)
  }

  const handleOptionChange = (fieldId, optionIndex, key, value) => {
    const updatedScreens = screens.map(screen => {
      if (screen.screenNo === currentStep) {
        const updatedFields = screen.fields.map(field => {
          if (field.id === fieldId) {
            const updatedOptions = field.options.map((option, index) => {
              if (index === optionIndex) {
                return {
                  ...option,
                  [key]: value
                }
              }

              return option
            })

            return {
              ...field,
              options: updatedOptions
            }
          }

          return field
        })

        return {
          ...screen,
          fields: updatedFields
        }
      }

      return screen
    })

    setScreens(updatedScreens)
  }

  const handleAddOption = id => {
    const updatedScreens = screens.map(screen => {
      if (screen.screenNo === currentStep) {
        return {
          ...screen,
          fields: screen.fields.map(field => {
            if (field.id === id) {
              return {
                ...field,
                options: [
                  ...field.options,
                  {
                    optionLabel: '',
                    optionValue: ''
                  }
                ]
              }
            }

            return field
          })
        }
      }

      return screen
    })

    setScreens(updatedScreens)
  }

  const handleDeleteField = id => {
    const updatedScreens = screens.map(screen => {
      if (screen.screenNo === currentStep) {
        return {
          ...screen,
          fields: screen.fields.filter(field => field.id !== id)
        }
      }

      return screen
    })

    setScreens(updatedScreens)
  }

  const handleScreenName = value => {
    const updatedScreens = screens.map(screen => {
      if (screen.screenNo === currentStep) {
        return {
          ...screen,
          screenName: value
        }
      }
      return screen
    })

    setScreens(updatedScreens)
  }

  const validateFields = () => {
    // Screen name validation
    if (!currentScreen.screenName.trim()) {
      setFieldError('Please fill all fields')
      return false
    }

    // Fields validation
    for (let field of currentScreen.fields) {
      // Common fields
      if (
        !field.fieldId.trim() ||
        !field.fieldName.trim() ||
        !field.fieldLabel.trim()
      ) {
        setFieldError('Please fill all fields')
        return false
      }

      // Text / Email / Password / Phone
      if (
        (field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password' ||
          field.type === 'phone') &&
        !field.maxLength
      ) {
        setFieldError('Please fill all fields')
        return false
      }

      // Number
      if (field.type === 'number' && (!field.minValue || !field.maxValue)) {
        setFieldError('Please fill all fields')
        return false
      }

      // Date
      if (field.type === 'date' && (!field.minDate || !field.maxDate)) {
  setFieldError('Please fill all fields')
  return false
}

      // Select / Radio / Checkbox options
      if (
        field.type === 'select dropdown' ||
        field.type === 'radio' ||
        field.type === 'checkbox'
      ) {
        if (field.options.length === 0) {
          setFieldError('Please fill all fields')
          return false
        }

        for (let option of field.options) {
          if (!option.optionLabel.trim() || !option.optionValue.trim()) {
            setFieldError('Please fill all fields')
            return false
          }
        }
      }
    }

    setFieldError('')
    return true
  }

  return (
    <div
      className='min-vh-100 d-flex align-items-center'
      // style={{
      //   background: 'linear-gradient(to right, #eef2ff, #fdf2f8)'
      // }}
    >
      <Container>
        <Row className='justify-content-center'>
          <Col md={8} lg={8}>
            <Card
              className='border-0 shadow-lg p-4 rounded-4'
              style={{
                backgroundColor: 'white'
              }}
            >
              <div className='text-center mb-4'>
                <h2
                  className='fw-bold text-primary'

                >
                  Step {currentStep} of {totalScreens}
                </h2>

                <p className='text-muted'>Configure your screen fields</p>
              </div>

              <Form>
                <div
                  style={{
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    padding: '10px',
                    display: 'block'
                  }}
                >
                  {/* Screen Name */}

                  <Form.Group className='mb-4'>
                    <Form.Label className='fw-semibold'>Screen Name</Form.Label>

                    <Form.Control
                      type='text'
                      placeholder='Enter screen name'
                      value={currentScreen?.screenName || ''}
                      onChange={e => handleScreenName(e.target.value)}
                      className='py-3 rounded-3 border-0'
                      style={{
                        backgroundColor: '#f3f4f6'
                      }}
                    />
                  </Form.Group>

                  {/* Field Type */}

                  <Form.Group className='mb-4'>
                    <Form.Label className='fw-semibold'>
                      Select Field Type
                    </Form.Label>

                    <Form.Select
                      className='py-3 rounded-3 border-0'
                      style={{
                        backgroundColor: '#f3f4f6'
                      }}
                      value={fieldType}
                      onChange={e => setFieldType(e.target.value)}
                    >
                      <option>Select field type</option>

                      <option value='text'>Text</option>

                      <option value='number'>Number</option>

                      <option value='email'>Email</option>

                      <option value='password'>Password</option>

                      <option value='phone'>Phone</option>

                      <option value='select dropdown'>Select Dropdown</option>

                      <option value='radio'>Radio</option>

                      <option value='checkbox'>Checkbox</option>

                      <option value='date'>Date</option>

                      <option value='textarea'>Textarea</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Add Field Button */}

                  <div className='mb-4'>
                    <Button
                      type='button'
                      className='w-100 py-3 rounded-3 border-0 fw-semibold bg-primary text-white'
                      // style={{
                      //   backgroundColor: '#6366f1'
                      // }}
                      disabled={!fieldType}
                      onClick={handleAddFields}
                    >
                      + Add Field
                    </Button>
                  </div>

                  {fieldError && (
                    <Alert variant='danger' className='text-center'>
                      {fieldError}
                    </Alert>
                  )}
                  {/* Fields */}
                  <div className='mt-4'>
                    {currentScreen?.fields.map(field => (
                      <Card
                        key={field.id}
                        className='border-0 shadow-sm p-4 rounded-4 mb-4'
                      >
                        <div className='d-flex justify-content-between align-items-center mb-4'>
                          <h5
                            className='fw-bold mb-4 text-primary'
                            // style={{
                            //   color: '#4f46e5'
                            // }}
                          >
                            {field.type.toUpperCase()} Field
                          </h5>

                          <Button
                            type='button'
                            variant='danger'
                            size='sm'
                            onClick={() => {
                              handleDeleteField(field.id)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                        {/* For Add Text, Email, Password field */}

                        {(field.type === 'text' ||
                          field.type === 'email' ||
                          field.type === 'password') && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Max Length */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Max Length</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Max length'
                                value={field.maxLength}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'maxLength',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>
                          </div>
                        )}

                        {/* For Add Number field */}

                        {field.type === 'number' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Min Value */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Minimum Value</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Min value'
                                value={field.minValue}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'minValue',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Max Value */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Maximum Value</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Max value'
                                 value={field.maxValue}
                                  onChange={e =>
                                    handleFieldChange(
                                    field.id,
                                    'maxValue',
                                    e.target.value
                                    )
                                  }
                              />
                            </Form.Group>
                          </div>
                        )}

                        {/* For Add Phone field */}

                        {field.type === 'phone' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Max Length */}
                            <Form.Group className='mb-3 col-md-3'>
                              <Form.Label>Max Length</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Max length'
                                // value={field.maxLength || 10}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'maxLength',
                                    e.target.value
                                  )
                                }
                                value={field.maxLength}
                                disabled
                              />
                            </Form.Group>
                          </div>
                        )}

                        {/* For Add Select field */}

                        {field.type === 'select dropdown' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Add Option Here */}
                            {field.options.map((option, index) => (
                              <React.Fragment key={index}>
                                {/* Option Value */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Value</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option value'
                                    value={option.optionValue}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionValue',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>

                                {/* Option Label */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Label</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option Label'
                                    value={option.optionLabel}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionLabel',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </React.Fragment>
                            ))}

                            {/* Add Option button */}
                            <div className='col-12'>
                              <Button
                                type='button'
                                className='col-md-3 fw-semibold btn btn-primary'
                                // style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                onClick={() => handleAddOption(field.id)}
                              >
                                + Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* For Add Radio field */}

                        {field.type === 'radio' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Add Option Here */}
                            {field.options.map((option, index) => (
                              <React.Fragment key={index}>
                                {/* Option Value */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Value</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option value'
                                    value={option.optionValue}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionValue',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>

                                {/* Option Label */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Label</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option Label'
                                    value={option.optionLabel}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionLabel',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </React.Fragment>
                            ))}

                            {/* Add Option button */}
                            <div className='col-12'>
                              <Button
                                type='button'
                                className='col-md-3 fw-semibold btn btn-primary'
                                // style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                onClick={() => handleAddOption(field.id)}
                              >
                                + Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* For Add Checkbox field */}

                        {field.type === 'checkbox' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Add Option Here */}
                            {field.options.map((option, index) => (
                              <React.Fragment key={index}>
                                {/* Option Value */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Value</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option value'
                                    value={option.optionValue}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionValue',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>

                                {/* Option Label */}
                                <Form.Group className='mb-3 col-md-6'>
                                  <Form.Label>Option Label</Form.Label>

                                  <Form.Control
                                    type='text'
                                    placeholder='Option Label'
                                    value={option.optionLabel}
                                    onChange={e =>
                                      handleOptionChange(
                                        field.id,
                                        index,
                                        'optionLabel',
                                        e.target.value
                                      )
                                    }
                                  />
                                </Form.Group>
                              </React.Fragment>
                            ))}

                            {/* Add Option button */}
                            <div className='col-12'>
                              <Button
                                type='button'
                                className='col-md-3 fw-semibold btn btn-primary'
                                // style={{ backgroundColor: 'rgb(79, 70, 229)' }}
                                onClick={() => handleAddOption(field.id)}
                              >
                                + Add Option
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* For Add Date Field */}

                        {field.type === 'date' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Min Date */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Min Date</Form.Label>

                              <Form.Control type='date'
                                   value={field.minDate}
                                    onChange={e =>
                                    handleFieldChange(
                                    field.id,
                                     'minDate',
                                     e.target.value
                                    )
                                  }
                                 />
                            </Form.Group>

                            {/* Max Date */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Max Date</Form.Label>

                              <Form.Control type='date'
                                 value={field.maxDate}
                                 onChange={e =>
                                  handleFieldChange(
                                  field.id,
                                  'maxDate',
                                  e.target.value
                                  ) 
                                }       

                               />
                            </Form.Group>
                          </div>
                        )}

                        {/* For Add TextArea Field */}

                        {field.type === 'textarea' && (
                          <div className='row'>
                            {/* Field ID */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field ID</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field id'
                                value={field.fieldId}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldId',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Name */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Name</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field name'
                                value={field.fieldName}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldName',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Field Label */}
                            <Form.Group className='mb-3 col-md-4'>
                              <Form.Label>Field Label</Form.Label>

                              <Form.Control
                                type='text'
                                placeholder='Field label'
                                value={field.fieldLabel}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'fieldLabel',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Max Length */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Max Length</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Max length'
                                value={field.maxLength}
                                onChange={e =>
                                  handleFieldChange(
                                    field.id,
                                    'maxLength',
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Group>

                            {/* Rows */}
                            <Form.Group className='mb-3 col-md-6'>
                              <Form.Label>Rows</Form.Label>

                              <Form.Control
                                type='number'
                                placeholder='Enter rows'
                              />
                            </Form.Group>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}

                <div className='d-flex gap-3'>
                  <Button
                    type='button'
                    variant='light'
                    className='w-50 py-2 rounded-3 fw-semibold'
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>

                  {currentStep < totalScreens ? (
                    <Button
                      type='button'
                      className='w-50 py-2 rounded-3 fw-semibold bg-primary text-white'
                      onClick={handleNext}
                      // style={{ backgroundColor: '#4f46e5' }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type='button'
                      className='w-50 py-2 rounded-3 fw-semibold bg-primary text-white'
                      onClick={() =>
                        navigate('/screengenerate', {
                          state: {
                            screens
                          }
                        })
                      }
                      // style={{ backgroundColor: '#4f46e5' }}
                    >
                      Finish
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ScreenBuilder

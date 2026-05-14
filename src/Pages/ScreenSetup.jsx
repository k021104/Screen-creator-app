import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function ScreenSetup () {
  const [screenCount, setScreenCount] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleNext = () => {
    if (!screenCount) {
      setError('Screen count is required')
      return
    } else if (screenCount <= 0) {
      setError('Screen count must be greater than 0')
      return
    }

    setError('')

    navigate('/screenbuilder', {
      state: {
        totalScreens: screenCount
      }
    })
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
          <Col md={7} lg={5}>
            <Card
              className='border-0 shadow-lg p-4 rounded-4'
              style={{
                backgroundColor: 'white'
              }}
            >
              <div className='text-center mb-4'>
                <h1
                  className='fw-bold text-primary'
                >
                  Screen Creator
                </h1>

                <p className='text-muted'>Build multi-step dynamic forms</p>
              </div>

              <Form>
                <Form.Group className='mb-4'>
                  <Form.Label className='fw-semibold'>
                    Number of Screens
                  </Form.Label>

                  <Form.Control
                    type='number'
                    placeholder='Enter screen count'
                    className='py-3 rounded-3 border-0'
                    value={screenCount}
                    onChange={e => setScreenCount(e.target.value)}
                    style={{
                      backgroundColor: '#f3f4f6'
                    }}
                  />
                  {error && <p className='text-danger mt-2 mb-0'>{error}</p>}
                </Form.Group>

                <div className='d-flex gap-3'>
                  <Button
                    variant='light'
                    className='w-50 py-2 rounded-3 fw-semibold'
                  >
                    Previous
                  </Button>

                  <Button
                    className='w-50 py-2 rounded-3 border-0 fw-semibold bg-primary text-white'
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ScreenSetup

import React, { useEffect, useState, useRef } from 'react';  
import axios from '../api/axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const LoanRecommendation = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    reason: 'Based on your transaction history',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false); // ✅ Track if loan is already applied

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get('/loans/recommend', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data || {};

        setRecommendation(data);
        setHasApplied(data.loanAlreadyApplied || false); // ✅ Based on backend flag
        setFormData({
          amount: data.recommendedAmount || '',
          duration: data.recommendedDuration || '',
          reason: 'Based on your transaction history',
        });
      } catch (err) {
        console.error('Error fetching recommendation:', err.response?.data || err.message);
        setError('Failed to fetch recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  useEffect(() => {
    if (submissionMessage) {
      const timer = setTimeout(() => setSubmissionMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionMessage]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmittingRef.current || hasApplied) return;

    setSubmissionMessage('');
    setError('');

    const minAmount = recommendation.recommendedAmount * 0.5;
    const maxAmount = recommendation.recommendedAmount * 1.5;

    if (formData.amount < minAmount || formData.amount > maxAmount) {
      setError(`Please enter an amount between ₹${minAmount.toFixed(0)} and ₹${maxAmount.toFixed(0)}.`);
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.post('/loans/apply', {
        amount: formData.amount,
        interestRate: recommendation.recommendedInterest,
        durationMonths: formData.duration
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Loan response:", res.data);
      setSubmissionMessage('Loan application submitted successfully.');
      setHasApplied(true); // ✅ Prevent reapplication
    } catch (err) {
      console.error("❌ Error submitting loan:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to submit loan application.');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleButtonClick = (e) => {
    if (isSubmittingRef.current || hasApplied) {
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading recommendation...</p>
      </div>
    );
  }

  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <div className="container mt-5">
      <h2>Loan Recommendation</h2>
      {recommendation && (
        <div className="card p-4 shadow mt-3">
          <p><strong>Status:</strong> {recommendation.eligible ? 'Eligible ✅' : 'Not Eligible ❌'}</p>

          {recommendation.eligible ? (
            <>
              <p><strong>Recommended Amount:</strong> ₹{recommendation.recommendedAmount}</p>
              <p><strong>Interest Rate:</strong> {recommendation.recommendedInterest}%</p>
              <p><strong>Duration:</strong> {recommendation.recommendedDuration} months</p>
              <p><strong>Message:</strong> {recommendation.message}</p>

              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>Loan Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min={recommendation.recommendedAmount * 0.5}
                    max={recommendation.recommendedAmount * 1.5}
                    step="100"
                    disabled={isSubmitting || hasApplied}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (in months)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                    min="1"
                    disabled={isSubmitting || hasApplied}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    disabled={isSubmitting || hasApplied}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || hasApplied}
                  onClick={handleButtonClick}
                >
                  {hasApplied ? 'Loan Already Applied' : isSubmitting ? 'Applying...' : 'Apply for Loan'}
                </Button>
              </Form>

              {submissionMessage && <Alert variant="success" className="mt-3">{submissionMessage}</Alert>}
            </>
          ) : (
            <Alert variant="warning" className="mt-3">
              {recommendation.message || 'You are currently not eligible for a loan. Please maintain healthy transaction activity.'}
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanRecommendation;

document.addEventListener('DOMContentLoaded', function() {
    // Get all OTP input fields
    const otpInputs = document.querySelectorAll('.otp-input');
    const verifyBtn = document.getElementById('verifyBtn');
    const message = document.getElementById('message');
    const resendLink = document.getElementById('resendLink');
    
    // Correct OTP for demo (in real app, this would be validated on server)
    const correctOTP = '1234';
    
    // Initialize OTP input functionality
    initializeOTPInputs();
    
    // Add event listeners
    verifyBtn.addEventListener('click', handleVerifyOTP);
    resendLink.addEventListener('click', handleResendOTP);
    
    function initializeOTPInputs() {
        otpInputs.forEach((input, index) => {
            // Handle input event
            input.addEventListener('input', function(e) {
                const value = e.target.value;
                
                // Only allow numbers
                if (!/^\d$/.test(value) && value !== '') {
                    e.target.value = '';
                    return;
                }
                
                // Add filled class if input has value
                if (value) {
                    e.target.classList.add('filled');
                    // Auto-focus next input
                    if (index < otpInputs.length - 1) {
                        otpInputs[index + 1].focus();
                    }
                } else {
                    e.target.classList.remove('filled');
                }
                
                // Remove error class when user starts typing
                e.target.classList.remove('error');
                
                // Check if all fields are filled
                checkAllFieldsFilled();
            });
            
            // Handle keydown event for backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    // Move to previous input on backspace
                    otpInputs[index - 1].focus();
                }
                
                // Handle paste event
                if (e.key === 'Enter') {
                    handleVerifyOTP();
                }
            });
            
            // Handle paste event
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                const digits = pastedData.replace(/\D/g, '').slice(0, 4);
                
                // Fill inputs with pasted digits
                digits.split('').forEach((digit, idx) => {
                    if (otpInputs[idx]) {
                        otpInputs[idx].value = digit;
                        otpInputs[idx].classList.add('filled');
                    }
                });
                
                // Focus last filled input or verify button
                if (digits.length === 4) {
                    verifyBtn.focus();
                } else if (digits.length > 0) {
                    otpInputs[digits.length].focus();
                }
                
                checkAllFieldsFilled();
            });
            
            // Handle focus event
            input.addEventListener('focus', function() {
                // Select all text when focused
                setTimeout(() => {
                    this.select();
                }, 10);
            });
        });
    }
    
    function checkAllFieldsFilled() {
        const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
        verifyBtn.disabled = !allFilled;
        
        if (allFilled) {
            verifyBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            verifyBtn.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        } else {
            verifyBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            verifyBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }
    }
    
    function getOTPValue() {
        return Array.from(otpInputs).map(input => input.value).join('');
    }
    
    function handleVerifyOTP() {
        const enteredOTP = getOTPValue();
        
        // Check if all fields are filled
        if (enteredOTP.length !== 4) {
            showMessage('Please enter all 4 digits', 'error');
            return;
        }
        
        // Disable button during verification
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying...';
        
        // Simulate API call delay
        setTimeout(() => {
            if (enteredOTP === correctOTP) {
                // Success
                verifyBtn.classList.add('success');
                verifyBtn.textContent = 'Verified ✓';
                showMessage('OTP verified successfully! Welcome back.', 'success');
                
                // Add success animation to inputs
                otpInputs.forEach(input => {
                    input.classList.add('filled');
                    input.classList.remove('error');
                });
                
                // Simulate redirect after success
                setTimeout(() => {
                    showMessage('Redirecting to dashboard...', 'success');
                }, 2000);
                
            } else {
                // Error
                verifyBtn.classList.add('error');
                verifyBtn.textContent = 'Invalid OTP';
                showMessage('Invalid OTP. Please try again.', 'error');
                
                // Add error animation to inputs
                otpInputs.forEach(input => {
                    input.classList.add('error');
                    input.classList.remove('filled');
                });
                
                // Clear inputs after error
                setTimeout(() => {
                    clearOTPInputs();
                    resetVerifyButton();
                }, 2000);
            }
        }, 1500);
    }
    
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type} show`;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            message.classList.remove('show');
        }, 5000);
    }
    
    function clearOTPInputs() {
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('filled', 'error');
        });
        otpInputs[0].focus();
        checkAllFieldsFilled();
    }
    
    function resetVerifyButton() {
        verifyBtn.classList.remove('success', 'error');
        verifyBtn.textContent = 'Verify OTP';
        verifyBtn.disabled = false;
    }
    
    function handleResendOTP() {
        // Simulate resend functionality
        resendLink.style.pointerEvents = 'none';
        resendLink.style.opacity = '0.5';
        
        showMessage('New OTP has been sent to your email address.', 'success');
        
        // Generate new OTP for demo (in real app, this would be done on server)
        console.log('New OTP generated: ' + correctOTP);
        
        // Clear current inputs
        clearOTPInputs();
        resetVerifyButton();
        
        // Re-enable resend link after 30 seconds
        setTimeout(() => {
            resendLink.style.pointerEvents = 'auto';
            resendLink.style.opacity = '1';
        }, 30000);
    }
    
    // Initialize focus on first input
    otpInputs[0].focus();
    
    // Handle form submission with Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !verifyBtn.disabled) {
            handleVerifyOTP();
        }
    });
    
    // Add some visual feedback effects
    function addVisualEffects() {
        // Add ripple effect to verify button
        verifyBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize visual effects
    addVisualEffects();
});
// Network Connectivity Test - Run this in browser console
async function testNetworkConnection() {
  console.log('🌐 Testing network connectivity...');
  
  try {
    // Test 1: Basic API endpoint
    console.log('Test 1: Testing basic API connectivity...');
    const response1 = await fetch('https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1/auth/login/', {
      method: 'OPTIONS',
    });
    console.log('✅ OPTIONS request successful:', response1.status);
    
    // Test 2: Actual login attempt
    console.log('Test 2: Testing login API...');
    const response2 = await fetch('https://ktl-isp-billing-app-qza33.ondigitalocean.app/api/v1/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_id: 'shamimkhaled',
        password: 'admin999'
      })
    });
    
    const data = await response2.json();
    console.log('✅ Login API response:', response2.status, data);
    
    if (data.success) {
      console.log('🎉 Network connectivity is working fine!');
      return true;
    } else {
      console.log('⚠️ Login failed but network is working');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Network test failed:', error);
    return false;
  }
}

// Run the test
testNetworkConnection();
const axios = require('axios');

async function testBackendConnection() {
  try {
    console.log('Testing backend connection...');
    const response = await axios.get('http://localhost:4000/health');
    console.log('✅ Backend is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Could not connect to backend:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

async function testFrontendConnection() {
  try {
    console.log('\nTesting frontend connection...');
    const response = await axios.get('http://localhost:8080');
    console.log('✅ Frontend is running');
    return true;
  } catch (error) {
    console.error('❌ Could not connect to frontend:', error.message);
    return false;
  }
}

async function testAuthRegistration() {
  try {
    console.log('\nTesting registration...');
    const testEmail = `testuser_${Date.now()}@gmail.com`;
    const response = await axios.post('http://localhost:4000/auth/register', {
      role: 'job_seeker',
      email: testEmail,
      password: 'test1234',
      first_name: 'Test',
      last_name: 'User'
    });
    console.log('✅ Registration test successful');
    console.log('   User ID:', response.data.user?.id);
    return response.data.user?.id;
  } catch (error) {
    console.error('❌ Registration test failed:', error.response?.data || error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting integration tests...');
  
  // Test backend connection
  const backendOk = await testBackendConnection();
  if (!backendOk) {
    console.log('\n⚠️  Please make sure the backend server is running (node app.js)');
    return;
  }
  
  // Test frontend connection
  const frontendOk = await testFrontendConnection();
  if (!frontendOk) {
    console.log('\n⚠️  Please make sure the frontend server is running (npm run dev)');
    return;
  }
  
  // Test authentication
  await testAuthRegistration();
  
  console.log('\n🎉 Integration tests completed!');
}

runTests().catch(console.error);

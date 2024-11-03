
import './App.css'
import OTPInput from './components/otp-input'
import Button from './components/ui/button'

function App() {

  return (
    <div className='w-screen h-screen bg-[#012b5a]'>
      <Button className='rounded-lg border-t-indigo-300 bg-cyan-300 p-2'>My button</Button>
      <br />
      <OTPInput count={10} className="w-10 h-10 text-white bg-[#19406a] outline-none m-2 pl-4 rounded-md focus:border border-y-gray-200" />
    </div>
  )
}

export default App

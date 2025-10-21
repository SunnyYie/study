import { useState } from 'react'
import './App.css'
import ButtonDemo from './components/ButtonDemo'
import CarouselDemo from './CarouselDemo.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    // <div className="min-h-screen bg-white">
    //   <div className="max-w-4xl mx-auto p-8">
    //     <div className="text-center mb-8">
    //       <div className="flex justify-center gap-4 mb-4">
    //         <a href="https://vite.dev" target="_blank">
    //           <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
    //         </a>
    //         <a href="https://react.dev" target="_blank">
    //           <img src={reactLogo} className="h-16 w-16" alt="React logo" />
    //         </a>
    //       </div>
    //       <h1 className="text-4xl font-bold mb-4">Shadcn Demo</h1>
    //       <p className="text-gray-600 mb-8">Turborepo + pnpm + React 19 + Tailwind CSS + NestJS</p>
    //     </div>

    //     <ButtonDemo />

    //     <div className="mt-8 p-6 border rounded-lg bg-gray-50">
    //       <h3 className="text-lg font-semibold mb-4">Original Counter Demo</h3>
    //       <div className="text-center">
    //         <button
    //           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    //           onClick={() => setCount(count => count + 1)}
    //         >
    //           count is {count}
    //         </button>
    //         <p className="mt-4 text-sm text-gray-600">
    //           Edit <code>src/App.tsx</code> and save to test HMR
    //         </p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <CarouselDemo />
  )
}

export default App

import { Outlet } from 'react-router';

function App() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <Outlet />
    </div>
  );
}

export default App;

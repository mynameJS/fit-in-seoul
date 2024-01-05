import './App.css';
import { useEffect } from 'react';
import { addData, fetchData } from './config/firebase';

const sampleData = {
  id: '123',
  pw: 'password',
  name: 'John Doe',
  gender: 'male',
  residence: 'New York',
  interest: 'Coding',
  nickname: 'JD',
  aboutme: 'I love programming!',
};

function App() {
  useEffect(() => {
    test();
  });

  async function test() {
    await addData(sampleData);
    const response = await fetchData();
    console.log(response);
  }

  return (
    <>
      <div>test</div>
    </>
  );
}
export default App;

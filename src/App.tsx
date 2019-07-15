import React from 'react';
import mappings from './data/mappings.json';
import {UserInput} from './components'
import styled from '@emotion/styled'

const AppContainer = styled.div`
  height: 100%;
  width: 100%;
`

const App: React.FC = () => {
  // const [submittedData, setSubmittedData] = useState<IData | undefined>(undefined);

  console.log(mappings)

  return (
    <AppContainer>
      <UserInput />
    </AppContainer>
  );
}

export default App;
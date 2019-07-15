import React from 'react';
import {UserInput} from './components'
import styled from '@emotion/styled'

const AppContainer = styled.div`
  height: 100%;
`

const App: React.FC = () => {

  return (
    <AppContainer>
      <UserInput />
    </AppContainer>
  );
}

export default App;
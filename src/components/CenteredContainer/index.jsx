import styled from "styled-components";

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  height: ${({ fullViewPort }) => {
    if (fullViewPort) return "100vh";
    return "initial";
  }};
`;

export default CenteredContainer;

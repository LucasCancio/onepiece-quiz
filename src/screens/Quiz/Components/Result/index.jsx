import styled from "styled-components";
import { motion } from "framer-motion";

const ResultText = styled.p`
  outline: 0;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.contrastText};
  background-color: ${({ theme, isSuccess }) => {
    if (isSuccess) return `${theme.colors.success}`;
    return `${theme.colors.wrong}`;
  }};
  padding: 10px 15px;
  margin-bottom: 15px;

  border-radius: ${({ theme }) => theme.borderRadius};
  transition: 0.3s;
  display: block;

  text-align: center;
`;

function Result({ ...props }) {
  return (
    <ResultText
      as={motion.section}
      transition={{ delay: 0, duration: 0.5 }}
      variants={{
        show: { opacity: 1 },
        hidden: { opacity: 0 },
      }}
      initial="hidden"
      animate="show"
      {...props}
    />
  );
}

export default Result;

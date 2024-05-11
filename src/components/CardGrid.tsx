import { ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../theme";

const CardGridWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const CardGridContent = styled.div`
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px 5px;
  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

/**
 * Display a grid of cards (not flashcards, but material cards)
 */
export function CardGrid({ children }: { children: ReactNode }): ReactElement {
  return (
    <CardGridWrapper>
      <CardGridContent>{children}</CardGridContent>
    </CardGridWrapper>
  );
}

const StyledGridCard = styled.div<{ color: string; textColor: string }>`
  box-sizing: border-box;
  width: 100%;
  max-width: 300px;
  border: 1px solid black;
  border-radius: 20px;
  margin: 0 auto;
  padding: 10px;
  background-color: ${(p) => p.color};
  color: ${(p) => p.textColor};
`;

const GridCardHeader = styled.a`
  display: inline-block;
  text-decoration: none;
  background-color: ${theme.colors.WHITE};
  border: none;
  border-radius: ${theme.borderRadii.md};
  padding: 5px;
  font-weight: bold;
  width: 100%;
  max-width: 250px;
  box-sizing: border-box;
  font-size: ${theme.fontSizes.md};
  color: ${theme.hanehldaColors.DARK_BLUE};
  margin: 0 auto 20px;
  border: 1px solid black;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
`;

export function GridCard({
  color,
  textColor = "inherit",
  title,
  link,
  children,
}: {
  color: string;
  textColor?: string;
  title: string;
  link: string;
  children: ReactNode;
}): ReactElement {
  return (
    <StyledGridCard color={color} textColor={textColor}>
      <GridCardHeader as={Link} to={link}>
        {title}
      </GridCardHeader>
      {children}
    </StyledGridCard>
  );
}

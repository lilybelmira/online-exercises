import styled from "styled-components";
import { useLesson } from "../../providers/LessonProvider";
import { useAnalyticsPageName } from "../../firebase/hooks";
import { devices, theme } from "../../theme";
import { exercises } from "./PracticeLesson";
import { Hr } from "../setup/common";
import { Link } from "react-router-dom";

const ExercisesWrapper = styled.div`
  display: grid;
  gap: 16px;
  margin: 0 auto;
  max-width: 1480px;
  grid-template-columns: 1fr;
  @media ${devices.laptop} {
    grid-template-columns: 1fr 1fr;
  }
`;

const PickExerciseHeading = styled.h2`
  color: ${theme.hanehldaColors.DARK_RED};
`;

/**
 * Show a list of options for execises a user can do to complete their vocab lesson.
 */
export function PickExercise() {
  const { lesson } = useLesson();
  useAnalyticsPageName("Pick exercise");
  return (
    <div>
      <PickExerciseHeading>Pick an exercise</PickExerciseHeading>
      <Hr />
      <ExercisesWrapper>
        {exercises
          // minigames are only allowed for _practice_ lessons
          .filter((e) => lesson.type === "PRACTICE" || !e.minigame)
          .map((exercise, idx) => (
            <ExerciseCard exercise={exercise} key={idx} />
          ))}
      </ExercisesWrapper>
    </div>
  );
}

const StartExerciseButton = styled.a`
  display: inline-block;
  border-radius: ${theme.borderRadii.sm};
  border: ${theme.borderRadii.border};
  box-shadow: ${theme.boxShadow.bs};
  background-color: ${theme.hanehldaColors.WHITE_BUTTON};&:hover {
    background-color: ${theme.hanehldaColors.WHITE_HIGHLIGHT};
  }
  color: ${theme.hanehldaColors.DARK_GRAY};
  text-decoration: none;
  font-size: 1.5em;
  padding: 4px 8px;
  margin: 0;
  margin-bottom: 8px;
`;

const StyledExerciseCard = styled.div`
  background-color: ${theme.hanehldaColors.DARK_BLUE};
  margin: 0 auto;
  max-width: 700px;
  border-radius: ${theme.borderRadii.sm};
  border: ${theme.borderRadii.border};
  box-shadow: ${theme.boxShadow.bs};
  padding: 16px;
  flex: 1;
  min-width: 250px;
  p {
    color: ${theme.colors.WHITE};
    font-size: 1.25em;
    margin: 0;
  }
`;

function ExerciseCard({
  exercise: { path, name, description },
}: {
  exercise: (typeof exercises)[number];
}) {
  return (
    <StyledExerciseCard>
      <StartExerciseButton as={Link} to={path}>
        {name}
      </StartExerciseButton>
      <p>{description}</p>
    </StyledExerciseCard>
  );
}

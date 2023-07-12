import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "../../components/Button";
import {
  isPhoneticsPreference,
  PhoneticsPreference,
  PREFERENCE_LITERATES,
} from "../../state/reducers/phoneticsPreference";
import { GROUPS, isGroupId } from "../../state/reducers/groupId";
import { SectionHeading } from "../../components/SectionHeading";
import { CollectionDetails } from "../../components/CollectionDetails";

import { collections, VocabSet } from "../../data/vocabSets";
import { useUserStateContext } from "../../providers/UserStateProvider";
import { TermsByProficiencyLevelChart } from "../../components/TermsByProficiencyLevelChart";
import { Step, wizardContext } from "./SetupWizard";
import { Form, FormSubmitButton } from "../signin/common";
import { Fieldset } from "../../components/Fieldset";
import { VisuallyHidden } from "../../components/VisuallyHidden";
import styled, { css } from "styled-components";
import { theme } from "../../theme";
import { Hr } from "./common";

export const PickCourseStep: Step = {
  name: "Pick course",
  Component: PickCourse,
};

const CourseList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 40px;
`;

const CourseLabel = styled.label<{ checked: boolean }>`
  flex: 0 max-content;
  font-weight: bold;
  border-radius: ${theme.borderRadii.md};
  padding: 20px;
  color: ${theme.colors.WHITE};
  background-color: ${theme.hanehldaColors.DARK_BLUE};
  border: 1px solid black;
  em {
    color: ${theme.colors.LIGHT_GRAY};
    font-style: normal;
  }
  ${({ checked }) =>
    checked &&
    css`
      background-color: ${theme.hanehldaColors.DARK_RED};
    `}
`;

function PickCourse(): ReactElement {
  const { finishPickCourse } = useContext(wizardContext);
  const [collectionId, setCollectionId] = useState<string>();

  function onRadioChanged(e: ChangeEvent<HTMLInputElement>) {
    const collectionId = e.target.value;
    setCollectionId(collectionId);
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (collectionId) finishPickCourse({ collectionId });
  }

  function totalTerms(vocab: VocabSet[]) {
    var t = 0;

    vocab.map((vocabSet) => (t += vocabSet.terms.length));

    return t;
  }

  return (
    <div>
      <p>
        <strong>Content on Hanehlda is broken up into courses.</strong> Some of
        these will follow along with a free textbook, like{" "}
        <em>See Say Write</em> or <em>We are Learning Cherokee</em>.
      </p>

      <Hr />
      <Form onSubmit={onSubmit}>
        <Fieldset>
          <legend>Select your first course below</legend>
          <CourseList>
            {Object.values(collections).map((collection, idx) => (
              <CourseLabel
                htmlFor={collection.id}
                key={idx}
                checked={collectionId == collection.id}
              >
                <VisuallyHidden>
                  <input
                    name={collection.title}
                    type="radio"
                    value={collection.id}
                    id={collection.id}
                    onChange={onRadioChanged}
                    checked={collectionId == collection.id}
                  />
                </VisuallyHidden>
                <span>
                  {collection.title}{" "}
                  <em>({totalTerms(collection.sets)} terms)</em>
                </span>
              </CourseLabel>
            ))}
          </CourseList>
        </Fieldset>
        <Hr />
        <FormSubmitButton type="submit">continue</FormSubmitButton>
        {/* <NavigationButtons
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          disabled={!canGoToNextStep}
        /> */}
      </Form>
    </div>
  );
}

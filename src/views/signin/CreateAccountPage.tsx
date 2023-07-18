import { FormEvent, ReactElement, useContext, useState } from "react";
import { Title } from "../../components/Title";
import {
  Page,
  ScrollWrapper,
  PageContent,
  HeaderLabel,
  Form,
  FormSubmitButton,
} from "./common";
import { HanehldaHeader } from "../../components/HanehldaHeader";
import styled from "styled-components";
import { theme } from "../../theme";
import { AuthErrorCodes, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  ErrorBanner,
  ErrorBannerProvider,
  errorBannerContext,
} from "../../components/ErrorBannerProvider";

export function CreateAccountPage(): ReactElement {
  return (
    <Page>
      <ScrollWrapper>
        <ErrorBannerProvider>
          <PageContent>
            <ErrorBanner />
            <HanehldaHeader>
              <HeaderLabel>Account creation</HeaderLabel>
            </HanehldaHeader>
            <CreateAccountContent />
          </PageContent>
        </ErrorBannerProvider>
      </ScrollWrapper>
    </Page>
  );
}

const StyledWelcome = styled.h3`
  background: ${theme.hanehldaColors.DARK_RED};
  color: ${theme.colors.WHITE};
  border-radius: ${theme.borderRadii.md};
  font-family: "Inika", serif;
  font-size: 30px;
  padding: 20px 0;
  max-width: 600px;
  margin: auto;
`;

const StyledContent = styled.div`
  padding: 20px;
`;

function CreateAccountContent(): ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setError } = useContext(errorBannerContext);
  function signUp(e: FormEvent) {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        navigate("/");
      })
      .catch((err: FirebaseError) => {
        if (err.code === AuthErrorCodes.EMAIL_EXISTS) {
          setError(
            <span>
              You already have an account with that email.{" "}
              <Link to="/signin">Would you like to sign in instead?</Link>
            </span>
          );
        } else if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
          setError(<span>Password too short. Try a longer password.</span>);
        } else {
          setError(
            <span>
              Something went wrong. Try using a different email address or a
              stronger password
            </span>
          );
        }
      });
  }
  return (
    <StyledContent>
      <StyledWelcome>Welcome to Hanehlda!</StyledWelcome>
      <p>
        This site helps users practice their Cherokee language skills in many
        different ways.
      </p>
      <strong>
        <p>First, you will need to set up an account!</p>
      </strong>
      <Form standalone onSubmit={signUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormSubmitButton style={{ marginTop: 20 }}>
          Create Account
        </FormSubmitButton>
      </Form>
    </StyledContent>
  );
}

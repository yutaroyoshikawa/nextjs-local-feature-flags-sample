import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import {
  generateFeatureFlags,
  httpHeadersToEnabledToggleNames,
} from "../modules/featureToggle";

type HomeProps = {
  featureToggle?: Record<"hoge", boolean>;
};

const Home: NextPage<HomeProps> = ({ featureToggle }) => {
  return (
    <>
      <h1>Home</h1>
      <Link href="/hoge">Hoge</Link>
      <h2>{featureToggle?.hoge ? "OK" : "NG"}</h2>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async (
  context
) => {
  const enabledToggleNames = httpHeadersToEnabledToggleNames(
    context.req.headers
  );
  const toggles = generateFeatureFlags(enabledToggleNames);

  return {
    props: {
      featureToggle: toggles,
    },
  };
};

export default Home;

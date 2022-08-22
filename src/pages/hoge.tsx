import type { GetServerSideProps, NextPage } from "next";
import { FEATURE_TOGGLE_HEADER_NAME } from "../modules/featureToggle";

type HomeProps = {
  featureToggle?: string;
};

const Hoge: NextPage<HomeProps> = ({ featureToggle }) => {
  return (
    <>
      <h1>Hoge</h1>
      <h2>{featureToggle}</h2>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const toggle = context.req.headers[FEATURE_TOGGLE_HEADER_NAME.toLowerCase()];

  const toggleValue = Array.isArray(toggle) ? toggle[0] : toggle;

  if (!toggleValue) {
    return {
      props: {},
    };
  }

  return {
    props: {
      featureToggle: toggleValue,
    },
  };
};

export default Hoge;

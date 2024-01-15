import Steps from "components/molecules/steps/steps";

const steps = [
  {
    label: "Create account",
    description: "Vitae sed mi luctus laoreet.",
  },
  {
    label: "Profile information",
    description: "Cursus semper viverra facilisis et et some more.",
  },
  {
    label: "Business information",
    description: "Penatibus eu quis ante.",
  },
  {
    label: "Theme",
    description: "Faucibus nec enim leo et.",
  },
  {
    label: "Preview",
    description: "listo et officia maiores porro ad non quas.",
  },
];

const CreditScreen = () => {
  return (
    <div className="flex flex-row min-h-fit">
      <div className="items-center justify-center self-center">
        <Steps steps={steps} />
      </div>
      <div>content</div>
    </div>
  );
};

export default CreditScreen;

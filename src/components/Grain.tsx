// Moving film grain for one section, above its images. The section must be `relative`.
// `colour`: soft-light, for coloured sections. `white`: multiply, for pure white sections.
export default function Grain({ surface }: { surface: "colour" | "white" }) {
  return (
    <div aria-hidden="true" className={`grain grain-${surface}`}>
      <div />
    </div>
  );
}

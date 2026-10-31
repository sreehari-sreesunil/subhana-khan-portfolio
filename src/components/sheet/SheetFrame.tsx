const COLUMNS = "ABCDEFGHIJKL".split("");
const ROWS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/** The thin frame of a drawing sheet, with a tick on each division. Phones keep four: their rows have no set height. */
export default function SheetFrame() {
  return (
    <div data-sheet-chrome aria-hidden="true">
      <span className="sheet-frame" />
      <div className="sheet-marks sheet-marks-x">
        {COLUMNS.map((letter, i) => (
          <span key={letter} className={i > 3 ? "hidden lg:block" : ""} />
        ))}
      </div>
      <div className="sheet-marks sheet-marks-y hidden lg:grid">
        {ROWS.map((row) => (
          <span key={row} />
        ))}
      </div>
    </div>
  );
}

import { Typography } from "@mui/material";
import { memo, useState } from "react";
import { ElectoralUnit } from "./components/electoralUnit";
import { NewElectoralUnit } from "./components/newElectoralUnit";
import { NewParty } from "./components/newParty";
import { PartyHeader } from "./components/partyHeader";
import {
  INITIAL_NUM_ELECTORAL_UNITS,
  INITIAL_NUM_ELECTORAL_UNIT_SEATS,
} from "./constants/electoralUnits";
import { INITIAL_PARTIES } from "./constants/parties";
import { StyledTd, StyledTh, StyledTr } from "./styled/tables";
import { calcTotalSeatsPerParty, distributeSeats } from "./utils/dhondt";

const MemoElectoralUnit = memo(ElectoralUnit);
const MemoPartyHeader = memo(PartyHeader);

function App() {
  const [parties, setParties] = useState<string[]>([...INITIAL_PARTIES]);
  const [electoralUnitsSeats, setElectoralUnitsSeats] = useState<number[]>(
    new Array(INITIAL_NUM_ELECTORAL_UNITS).fill(
      INITIAL_NUM_ELECTORAL_UNIT_SEATS
    )
  );
  const [votes, setVotes] = useState<number[][]>(
    new Array(INITIAL_NUM_ELECTORAL_UNITS).fill(
      new Array(INITIAL_PARTIES.length).fill(0)
    )
  );
  const finalSeats = votes.map((electoralUnitVotes, idx) =>
    distributeSeats(electoralUnitVotes, electoralUnitsSeats[idx])
  );
  const totalSeatsPerParty = calcTotalSeatsPerParty(finalSeats);

  return (
    <>
      <Typography variant="h3">Гласови</Typography>
      <br />
      <table>
        <StyledTr>
          <th>&nbsp;</th>
          {parties.map((party, idx) => (
            <StyledTh>
              <MemoPartyHeader
                party={party}
                idx={idx}
                setParties={setParties}
                setVotes={setVotes}
              />
            </StyledTh>
          ))}
          <StyledTh>
            <NewParty setParties={setParties} setVotes={setVotes} />
          </StyledTh>
        </StyledTr>
        {votes.map((_, idx) => (
          <StyledTr>
            <MemoElectoralUnit
              key={idx}
              idx={idx}
              seats={electoralUnitsSeats[idx]}
              numParties={parties.length}
              setVotes={setVotes}
            />
            {!idx && <td rowSpan={votes.length}>&nbsp;</td>}
          </StyledTr>
        ))}
        <StyledTr>
          <StyledTd>
            <NewElectoralUnit
              setElectoralUnitSeats={setElectoralUnitsSeats}
              setVotes={setVotes}
            />
          </StyledTd>
          <td colSpan={parties.length}>&nbsp;</td>
        </StyledTr>
      </table>
      <br />
      <Typography variant="h3">Освоени мандати</Typography>
      <br />
      <table>
        <StyledTr>
          <th>&nbsp;</th>
          {parties.map((party, idx) => (
            <StyledTh>
              <Typography key={idx} variant="overline">
                {party}
              </Typography>
            </StyledTh>
          ))}
        </StyledTr>
        {finalSeats.map((electoralUnitFinalSeats, electoralUnitIdx) => (
          <StyledTr>
            <StyledTd>
              <Typography variant="overline">
                Изборна единица {electoralUnitIdx + 1}
              </Typography>
            </StyledTd>
            {electoralUnitFinalSeats.map((seats, idx) => (
              <StyledTd>
                <Typography key={idx} variant="overline">
                  {seats}
                </Typography>
              </StyledTd>
            ))}
          </StyledTr>
        ))}
        <StyledTr>
          <StyledTd>
            <Typography variant="overline" fontWeight={"bold"}>
              Вкупно
            </Typography>
          </StyledTd>
          {totalSeatsPerParty.map((totalSeats) => (
            <StyledTd>
              <Typography variant="overline" fontWeight={"bold"}>
                {totalSeats}
              </Typography>
            </StyledTd>
          ))}
        </StyledTr>
      </table>
    </>
  );
}

export default App;
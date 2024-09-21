import { useEffect, useState } from "react";
import "./App.css";
import flatMap from "lodash/flatMap";
import maxBy from "lodash/maxBy";
import orderBy from "lodash/orderBy";
import Grid from "@mui/material/Grid2";
import startCase from "lodash/startCase";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import toLower from "lodash/toLower";
import { Candidate, candidateEnum, District, ElectionResults } from "./types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Backdrop,
  CircularProgress,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CountUp from "react-countup";
import { fetchElectionData } from "./apis";
import DistrictSummary from "./DistrictSummary";

// function formatPercentage(value: number | undefined | null): string {
//   return value.toFixed(2);
// }

function formatVoteCount(value: number | undefined | null): string {
  return value ? new Intl.NumberFormat("en-US").format(value) : "N/A";
}

interface CandidateCardProps {
  color: string;
  cKey: string;
  data: Candidate | undefined;
}

const CandidateCard = ({ cKey, color, data }: CandidateCardProps) => {
  const appTheme = useTheme();
  const XS_MATCHES = useMediaQuery(appTheme.breakpoints.down("sm"));

  return (
    <div className="card" style={{ backgroundColor: hexToRgba(color, 0.9) }}>
      <div className="fade-bottom">
        <img src={require(`../src/assets/${cKey}.png`)} alt="" />
        <div className="centered-text">
          <div
            className="candi-name"
            style={{ fontSize: XS_MATCHES ? "1.2rem" : "1.5rem" }}
          >
            {candidateEnum.get(cKey)}
          </div>
          <div>
            <div className="flex-column-center">
              Total Votes
              <span style={{ fontSize: XS_MATCHES ? "2rem" : "2.6rem" }}>
                <CountUp preserveValue end={data?.data.value ?? 0} />
              </span>
            </div>
            <div style={{ fontSize: XS_MATCHES ? "1.8rem" : "2.1rem" }}>
              <CountUp
                preserveValue
                decimals={2}
                suffix="%"
                end={data?.data.percentage ?? 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function hexToRgba(hex: string, opacity: number): string {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // If the hex value is 8 characters long, it's a hex with alpha
  if (hex.length === 8) {
    // Extract alpha and color
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const a = parseInt(hex.substr(6, 2), 16) / 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity * a})`;
  }

  // If the hex value is 6 characters long, it's a hex without alpha
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function App() {
  const appTheme = useTheme();
  const XS_MATCHES = useMediaQuery(appTheme.breakpoints.down("sm"));
  const [electionData, setElectionData] = useState<ElectionResults | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchElectionData();
        setElectionData(data);
      } catch (error) {
        setError("Failed to fetch election data.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchDataWithoutLoading = async () => {
      try {
        const data = await fetchElectionData();
        setElectionData(data);
      } catch (error) {
        setError("Failed to fetch election data.");
      }
    };

    const intervalId = setInterval(() => {
      fetchDataWithoutLoading();
    }, 10000); // 10 seconds interval

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, []);

  const getBulletColor = (dis: District) => {
    const highestPercentageCandidate = maxBy(
      dis.candidates.map((candidate) => ({
        ...candidate,
        data: {
          ...candidate.data,
          percentage: candidate.data.percentage || 0, // Handle null percentages
        },
      })),
      (candidate: { data: { percentage: any } }) => candidate.data.percentage
    );

    switch (highestPercentageCandidate?.name) {
      case "akd":
        return "#c40a4b";
      case "sp":
        return "#b1b802";
      case "rw":
        return "#018241";
      default:
        return "#484848";
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#eff2f5" }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        container
        marginBottom={4}
        padding={XS_MATCHES ? 2 : 8}
        overflow="auto"
      >
        <AppBar
          component="nav"
          style={{ textAlign: "center", backgroundColor: "#333" }}
          className="app-bar"
        >
          <div>
            <img
              src={require("./assets/Flag_of_Sri_Lanka.svg.png")}
              height={30}
              alt=""
            />
            <Typography
              paddingTop={1}
              style={{ textTransform: "uppercase", fontSize: "1.3rem" }}
            >
              presidential election - 2024
            </Typography>
          </div>
        </AppBar>
        <Grid
          container
          spacing={XS_MATCHES ? 2 : 5}
          size={12}
          marginTop={XS_MATCHES ? 12 : 9}
          marginBottom={4}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <CandidateCard
              data={electionData?.candidates[0]}
              cKey="akd"
              color="#c40a4b"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CandidateCard
              data={electionData?.candidates[1]}
              cKey="sp"
              color="#b1b802"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CandidateCard
              data={electionData?.candidates[2]}
              cKey="rw"
              color="#018241"
            />
          </Grid>
        </Grid>
        {/*  */}
        {electionData && (
          <div
            style={{
              width: "100%",
            }}
          >
            {orderBy(
              flatMap(electionData.provinces, (province) => province.districts),
              ["name"],
              ["asc"]
            ).map((district) => {
              if (
                !district.candidates.every(
                  (x) => x.data.value === 0 || x.data.value === null
                )
              ) {
                return (
                  <div key={district.name} className="discard">
                    <Accordion
                      style={{
                        backgroundColor: "#ffffff",
                        boxShadow: "none",
                        border: "none",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                      >
                        <div className="distitle">
                          <CircleIcon
                            fontSize="small"
                            htmlColor={getBulletColor(district)}
                          />
                          {`${district.name} (
                      ${
                        district.divisions.filter((x) => x.totalValidVotes)
                          .length
                      }/${district.divisions.length})`}
                        </div>
                      </AccordionSummary>
                      <AccordionDetails>
                        <DistrictSummary key={district.name} data={district} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              }
            })}
          </div>
        )}
        {/*  */}
      </Grid>
      <footer className="footer">
        <p>&copy; 2024 Avishka. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;

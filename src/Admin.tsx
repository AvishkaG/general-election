import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import flatMap from "lodash/flatMap";
import orderBy from "lodash/orderBy";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import {
  candidateEnum,
  District,
  Division,
  ElectionResults,
  Province,
  VoteUpdatePayload,
} from "./types";
import Grid from "@mui/material/Grid2";
import { fetchElectionData, updateVotes } from "./apis";

const Admin = () => {
  const [district, setDistrict] = useState("");
  const [division, setDivision] = useState("");

  const [districts, setDistricts] = useState<District[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);

  const [total, setTotal] = useState<number | undefined>(undefined);
  const [akd, setAkd] = useState<number | undefined>(undefined);
  const [sp, setSp] = useState<number | undefined>(undefined);
  const [rw, setRw] = useState<number | undefined>(undefined);

  const [electionData, setElectionData] = useState<ElectionResults | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchElectionData();
        setElectionData(data);
        buildDistrictList(data);
      } catch (error) {
        setError("Failed to fetch election data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    console.log(electionData);
  }, [electionData]);

  const buildDistrictList = (data: ElectionResults) => {
    const districts = flatMap(data.provinces, (province) => province.districts);
    setDistricts(orderBy(districts, ["name"], ["asc"]));
  };

  const buildDivisionList = (districtName: string) => {
    const result = find(districts, { name: districtName });
    setDivisions(result ? result.divisions : []);
  };

  const handleChangeDistrict = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setDistrict(value);
    buildDivisionList(value);
  };
  const handleChangeDivision = (event: SelectChangeEvent) => {
    setDivision(event.target.value as string);
  };

  let isButtonDisabled: boolean = false;

  const handleSubmit = () => {
    const payload: VoteUpdatePayload = {
      district,
      division,
      totalValidVotes: total ?? 0,
      akdVotes: akd ?? 0,
      spVotes: sp ?? 0,
      rwVotes: rw ?? 0,
    };

    updateVotes(payload)
      .then((response) => {
        console.log("API response:", response);
        setOpen(true);
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container width="100%" spacing={2} padding={4}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          This is a success Alert inside a Snackbar!
        </Alert>
      </Snackbar>
      <Grid size={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">DISTRICT</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={district}
            label="DISTRICT"
            onChange={handleChangeDistrict}
          >
            {districts.map((dis) => (
              <MenuItem key={dis.name} value={dis.name}>
                {dis.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth disabled={isEmpty(district)}>
          <InputLabel id="demo-simple-select-label">DIVISION</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={division}
            label="DIVISION"
            onChange={handleChangeDivision}
          >
            {divisions.map((div) => (
              <MenuItem key={div.name} value={div.name}>
                {div.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth disabled={isEmpty(district)}>
          <TextField
            id="outlined-basic"
            type="number"
            label="TOTAL"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
            variant="outlined"
          />
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth disabled={isEmpty(division)}>
          <TextField
            id="outlined-basic"
            type="number"
            label={candidateEnum.get("akd")}
            onChange={(e) => setAkd(Number(e.target.value))}
            value={akd}
            variant="outlined"
          />
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth disabled={isEmpty(division)}>
          <TextField
            id="outlined-basic"
            type="number"
            label={candidateEnum.get("sp")}
            onChange={(e) => setSp(Number(e.target.value))}
            value={sp}
            variant="outlined"
          />
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth disabled={isEmpty(division)}>
          <TextField
            id="outlined-basic"
            type="number"
            label={candidateEnum.get("rw")}
            value={rw}
            onChange={(e) => setRw(Number(e.target.value))}
            variant="outlined"
          />
        </FormControl>
      </Grid>
      <Grid size={4} sx={{ margin: "30px auto" }}>
        <FormControl fullWidth>
          <Button
            variant="contained"
            size="large"
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Admin;

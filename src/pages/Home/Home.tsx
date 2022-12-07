import React, { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import { useQuery, gql } from "@apollo/client";
import { capitalizeFirstLetter } from "../../utility/capitalize";

const POKE_QUERY = gql`
  query {
    gen3_species: pokemon_v2_pokemonspecies(
      where: { pokemon_v2_generation: { name: { _eq: "generation-iii" } } }
      order_by: { id: asc }
    ) {
      name
      id
    }
  }
`;

const MAX_LENGTH = 6;

type Pokemon = { id: number; name: string };

export const Home: React.FC = () => {
  const { data, loading, error } = useQuery(POKE_QUERY);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const options: Pokemon[] = data?.gen3_species ?? [];

  const indexedPokemon = useMemo(() => {
    if (data?.gen3_species && options?.length) {
      return _.groupBy(data?.gen3_species, "id");
    }
    return {};
  }, [data]);

  const removePokemonById = useCallback(
    (id: string) => {
      if (selectedOptions.indexOf(id) != null) {
        setSelectedOptions((items) => {
          return items.filter((item) => item !== id);
        });
      }
    },
    [selectedOptions, setSelectedOptions]
  );

  useEffect(() => {
    const saved = JSON.parse(`${window.localStorage.getItem("names")}`);
    if (saved?.length) {
      setSelectedOptions(saved);
    }
  }, [setSelectedOptions]);

  useEffect(() => {
    localStorage.setItem("names", JSON.stringify(selectedOptions));
  }, [selectedOptions]);

  return (
    <Box
      sx={{
        my: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        Pick your Pokemon
      </Typography>
      <Box sx={{ width: 500 }}>
        <Autocomplete
          disabled={selectedOptions.length >= MAX_LENGTH}
          id="combo-box-poke"
          inputValue={inputValue}
          onInputChange={(event, newInputValue, reason) => {
            if (reason !== "reset") {
              setInputValue(newInputValue);
            }
          }}
          getOptionLabel={(option) => capitalizeFirstLetter(option?.name)}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          loading={loading}
          onChange={(event, val) => {
            if (
              val?.id &&
              !selectedOptions.includes(`${val?.id}`) &&
              selectedOptions.length < MAX_LENGTH
            ) {
              setSelectedOptions((initialVals) => [
                ...initialVals,
                `${val?.id}`,
              ]);
              setInputValue("");
            }
          }}
          options={options}
          renderInput={(params) => (
            <TextField {...params} label="Add a Pokemon to your den" />
          )}
          renderOption={(props, option) => {
            return (
              <Box ml={1} sx={{ display: "flex", flexDirection: "row" }}>
                <Avatar
                  sx={{ padding: 0.85 }}
                  src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${option.id}.svg`}
                />

                <Typography {...props} ml={0.8}>
                  {capitalizeFirstLetter(option?.name)}
                </Typography>
              </Box>
            );
          }}
        />
        <Box mt={2}>
          <List dense={false}>
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const selection = selectedOptions?.[idx];
              return (
                <ListItem
                  key={(selection ?? "") + idx}
                  secondaryAction={
                    selection ? (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removePokemonById(selection)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    ) : undefined
                  }
                  sx={{
                    borderColor: "grey",
                    borderWidth: 0.5,
                    borderStyle: "solid",
                    borderRadius: 4,
                    marginBottom: 2,
                    height: 60,
                  }}
                >
                  {!selection ? (
                    <>
                      <ListItemText
                        primary="Your Pokemon here"
                        primaryTypographyProps={{
                          color: "textSecondary",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <ListItemAvatar>
                        <Avatar
                          src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${parseInt(
                            selection
                          )}.svg`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={capitalizeFirstLetter(
                          (indexedPokemon?.[parseInt(selection)]?.[0] as Pokemon)
                            ?.name ?? ""
                        )}
                      />
                    </>
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

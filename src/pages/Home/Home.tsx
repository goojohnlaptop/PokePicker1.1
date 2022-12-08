import React, { useCallback, useEffect, useMemo, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Autocomplete,
  Avatar,
  IconButton,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import _ from "lodash";
import { useQuery, gql } from "@apollo/client";
import { capitalizeFirstLetter } from "../../utility/capitalize";

const POKE_QUERY = gql`
  query {
    characters {
      results {
        name
        id
      }
    }
  }
`;

const MAX_LENGTH = 6;

type Pokemon = { id: number; name: string };

export const Home: React.FC = () => {
  const { data, loading, error } = useQuery(POKE_QUERY);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [openPokemon, setOpenPokemon] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<any | null>(null);
  //   React.MouseEvent<HTMLLIElement, MouseEvent>
  const isListFull = selectedOptions.length >= MAX_LENGTH;

  const options: Pokemon[] = useMemo(
    () => data?.characters?.results ?? [],
    [data?.characters]
  );

  const indexedPokemon = useMemo(() => {
    if (options && options?.length) {
      return _.groupBy(options, "id");
    }
    return {};
  }, [options]);

  const addSearchIconToEndAdornment = (endAdornment: any) => {
    if (isListFull) {
      return React.Children.toArray(
        <InputAdornment position="end">
          <Link onClick={clearAll} underline="none" mr={1}>
            Clear den
          </Link>
        </InputAdornment>
      );
    }
    return React.cloneElement(
      endAdornment,
      {},
      React.Children.toArray(endAdornment.props.children)
    );
  };

  const handleClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    id: string
  ) => {
    setOpenPokemon(id);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenPokemon("");
  };

  const popoverOpen = Boolean(anchorEl);
  const popoverId = popoverOpen ? "poke-popover" : undefined;

  const clearAll = useCallback(() => {
    setSelectedOptions([]);
  }, [setSelectedOptions]);

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
    <>
      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {!!openPokemon?.length && (
          <Box
            p={3}
            sx={{
              maxHeight: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-modal-title"
              mb={2}
              variant="h4"
              component="h2"
            >
              {capitalizeFirstLetter(
                (indexedPokemon?.[parseInt(openPokemon)]?.[0] as Pokemon)
                  ?.name ?? ""
              )}
            </Typography>
            <img
              src={require(`../../assets/dream-world/${openPokemon}.svg`)}
              width={150}
            />
          </Box>
        )}
      </Popover>
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
            clearIcon={<></>}
            disabled={isListFull}
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
            forcePopupIcon={!isListFull}
            options={options}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: addSearchIconToEndAdornment(
                    params.InputProps.endAdornment
                  ),
                }}
                label={
                  isListFull
                    ? "Pokemon den is full"
                    : "Add a Pokemon to your den"
                }
              />
            )}
            renderOption={(props, option) => {
              return (
                <Box
                  key={option?.id}
                  ml={1}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <Avatar
                    sx={{ padding: 0.85 }}
                    src={require(`../../assets/dream-world/${option.id}.svg`)}
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
                    aria-describedby={popoverId}
                    onClick={(evt) => handleClick(evt, selection)}
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
                            src={require(`../../assets/dream-world/${parseInt(
                              selection
                            )}.svg`)}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={capitalizeFirstLetter(
                            (
                              indexedPokemon?.[
                                parseInt(selection)
                              ]?.[0] as Pokemon
                            )?.name ?? ""
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
    </>
  );
};

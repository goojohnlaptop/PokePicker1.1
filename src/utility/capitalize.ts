export const capitalizeFirstLetter = (str: string)  => {
    return str?.length ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }
  
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";

import { League, CreateLeagueResponse } from "../../../../../../generated-api";
import leagueService from "../../../../../services/league/leagueService";

import usePostApi from "../../../../../hooks/usePostApi";
import useForm from "../../../../../hooks/useForm";

import {
  CreateLeagueFormData,
  validateCreateLeague,
} from "../../../../../utils/league/formValidation";

import FormInput from "../../../../ui/forms/FormInput";
import Select from "../../../../ui/forms/Select";
import Form from "../../../../ui/forms/Form";

import CloseIcon from "../../../../../assets/close.svg";

interface CreateLeagueFormProps {
  setShowCreateLeagueForm: React.Dispatch<React.SetStateAction<boolean>>;
  setLeagues: React.Dispatch<React.SetStateAction<League[]>>;
  leagues: League[];
}

const seasonOptions = [
  { label: "Season 47", value: "47" },
  { label: "Season 48", value: "48" },
  { label: "Season 49", value: "49" },
];

const CreateLeagueForm: React.FC<CreateLeagueFormProps> = ({
  setShowCreateLeagueForm,
  setLeagues,
  leagues,
}) => {
  const account = useSelector((state: RootState) => state.auth.account);

  const {
    data: createLeagueResponse,
    isLoading,
    error,
    execute: createLeague,
  } = usePostApi<CreateLeagueResponse>(leagueService.createLeague);

  const {
    values,
    errors: formValidationError,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<CreateLeagueFormData>({
    initialValues: { name: "", seasonId: 47 },
    validate: validateCreateLeague,
    onSubmit: (values) =>
      createLeague(values.name, values.seasonId, account!.profileId),
    requiredFields: ["name", "seasonId"],
  });

  useEffect(() => {
    if (createLeagueResponse?.league) {
      setLeagues([createLeagueResponse.league, ...leagues]);
      setShowCreateLeagueForm(false);
    }
  }, [createLeagueResponse, setLeagues, leagues, setShowCreateLeagueForm]);

  return (
    <div className="relative">
      {/* Close Button */}
      <div
        onClick={() => setShowCreateLeagueForm(false)}
        className="cursor-pointer p-2 absolute top-2 right-2  transition duration-300 transform hover:scale-105 hover:bg-red-200 active:bg-red-400 rounded-full"
        aria-label="Create League"
      >
        <img
          src={CloseIcon}
          alt="Create League"
          className="w-6 h-6 transition-colors duration-300"
        />
      </div>
      {/* Form with Input Fields */}
      <Form
        title="Create a new league"
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled || isLoading}
        submitError={error} // Use hook's error state
        isLoading={isLoading} // Use hook's loading state
      >
        <div className="flex flex-col items-center space-y-2 md:flex-row md:items-start md:space-y-0 md:space-x-2 w-full">
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            error={formValidationError.name}
            required
            className="w-full md:w-3/4"
          />
          <Select
            label="Season"
            name="seasonId"
            value={values.seasonId}
            onChange={handleChange}
            options={seasonOptions}
            onBlur={() => handleBlur("seasonId")}
            error={formValidationError.seasonId}
            required
            className="w-full md:w-1/4"
          />
        </div>
      </Form>
    </div>
  );
};

export default CreateLeagueForm;
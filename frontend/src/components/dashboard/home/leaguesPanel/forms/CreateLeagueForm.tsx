import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CreateLeagueResponse, League } from "../../../../../../generated-api";
import CloseIcon from "../../../../../assets/close.svg";
import useForm from "../../../../../hooks/useForm";
import leagueService from "../../../../../services/league/leagueService";
import { RootState } from "../../../../../store/store";
import {
  CreateLeagueFormData,
  validateCreateLeague,
} from "../../../../../utils/league/formValidation";
import FormInput from "../../../../ui/forms/FormInput";
import SubmitButton from "../../../../ui/forms/SubmitButton";

interface CreateLeagueFormProps {
  setShowCreateLeagueForm: React.Dispatch<React.SetStateAction<boolean>>;
  setLeagues: React.Dispatch<React.SetStateAction<League[]>>;
  leagues: League[];
}

const CreateLeagueForm: React.FC<CreateLeagueFormProps> = ({
  setShowCreateLeagueForm,
  setLeagues,
  leagues,
}) => {
  const [responseError, setResponseError] = useState("");
  const account = useSelector((state: RootState) => state.auth.account);


  const onSubmit = async (values: CreateLeagueFormData): Promise<void> => {
    try {
      const createLeagueResponse: AxiosResponse<CreateLeagueResponse> =
        await leagueService.createLeague(values.name, values.seasonId, account!.profileId);
      if (
        createLeagueResponse.status === 201 &&
        createLeagueResponse.data?.league
      ) {
        setLeagues([createLeagueResponse.data.league, ...leagues]);
        setShowCreateLeagueForm(false)
      } else {
        setResponseError(
          createLeagueResponse.data?.message ||
            "Something went wrong when trying to create the league. Please try again."
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponseError(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again."
        );
      } else {
        console.error(error);
        setResponseError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const onClickClose = (): void => {
    setShowCreateLeagueForm(false);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<CreateLeagueFormData>({
    initialValues: { name: "", seasonId: "47" },
    validate: validateCreateLeague,
    onSubmit,
    requiredFields: ["name", "seasonId"],
  });

  return (
    <form onSubmit={handleSubmit} className=" mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Create League Request
        </h2>
        <div
          onClick={onClickClose}
          className="cursor-pointer p-2 my-auto transition duration-300 transform hover:scale-105 hover:bg-red-200 active:bg-red-400 rounded-full"
          aria-label="Create League"
        >
          <img
            src={CloseIcon}
            alt="Create League"
            className="w-6 h-6 transition-colors duration-300"
          />
        </div>
      </div>
      <div className="space-y-6">
        <FormInput
          label="Name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={() => {}}
          error={errors.name}
          required
        />
        <FormInput
          label="SeasonId"
          name="season"
          type="text"
          value={values.seasonId}
          onChange={handleChange}
          onBlur={() => {}}
          error={errors.seasonId}
          required
        />

        {responseError && (
          <p className="text-red-500 text-center py-2 px-4 border border-red-500 rounded-md bg-red-100">
            {responseError}
          </p>
        )}

        <div className="flex justify-center">
          <SubmitButton disabled={isSubmitDisabled} label="Create" />
        </div>
      </div>
    </form>
  );
};

export default CreateLeagueForm;

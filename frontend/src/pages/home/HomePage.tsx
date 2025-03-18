import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import LoggedInHomePage from './LoggedInHomePage';
import NotLoggedInHomePage from './NotLoggedInHomePage';
import { LeagueMemberSurvey } from '../../../generated-api';
import Survey from '../../components/league/survey/Survey';
const surveyInfo = `{
  "episodeId": "d3e4f5a6-b7c8-9012-3456-789012abcdef",
  "dueDate": "2025-03-19T00:00:00.000Z",
  "openDate": "2025-03-12T00:00:00.000Z",
  "episodeSurveyId": "3b40fb74-421d-4bcb-bfaa-bd8fb589b079",
  "surveyAvailabilityStatus": "Available",
  "surveyDefinitionId": "550e8400-e29b-41d4-a716-446655440000",
  "picks": [
      {
          "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          "description": "Which Tribe will go to tribal council?",
          "optionType": "tribe",
          "pointValue": 5,
          "options": []
      },
      {
          "id": "b9d1c2e3-f4a5-4b7c-8d9e-0f1a2b3c4d5e",
          "description": "Who will be eliminated in the next episode?",
          "optionType": "survivor",
          "pointValue": 5,
          "options": [
              {
                  "id": "c5b905b9-4fb2-448b-91f4-845684f6ef29",
                  "firstName": "Bianca",
                  "lastName": "Roses",
                  "fromCity": "West Orange",
                  "fromState": "N.J.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "95643a5d-4e82-4819-aa3a-15a206420645",
                  "firstName": "Cedrek",
                  "lastName": "McFadden",
                  "fromCity": "Columbia",
                  "fromState": "S.C.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "a7e401b1-82e4-4367-a228-c802196fc74c",
                  "firstName": "Charity",
                  "lastName": "Neims",
                  "fromCity": "Monroe",
                  "fromState": "Mich.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "cae5c79b-225d-4e11-95ea-c3dd748c298d",
                  "firstName": "Chrissy",
                  "lastName": "Sarnowsky",
                  "fromCity": "South Side of Chicago",
                  "fromState": "Ill.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "7ac01e6e-137a-4b3b-aead-fefc9786dd7f",
                  "firstName": "David",
                  "lastName": "Kinne",
                  "fromCity": "Long Beach",
                  "fromState": "Calif.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "49156c54-b901-4582-9167-2d6271b07e9f",
                  "firstName": "Eva",
                  "lastName": "Erickson",
                  "fromCity": "Eagan",
                  "fromState": "Minn.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "1d9f759e-1bfb-47e2-97c3-15ae79b85636",
                  "firstName": "Joe",
                  "lastName": "Hunter",
                  "fromCity": "Vacaville",
                  "fromState": "Calif.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "46a4dc9f-b63d-4d9e-8360-36d36d46f71e",
                  "firstName": "Kamilla",
                  "lastName": "Karthigesu",
                  "fromCity": null,
                  "fromState": "Toronto",
                  "fromCountry": "Canada",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "cf464b55-5bea-4b6b-8a81-f74686669e43",
                  "firstName": "Kyle",
                  "lastName": "Fraser",
                  "fromCity": "Roanoke",
                  "fromState": "Va.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "76b6811f-df81-4e8c-bcae-10056bff43fa",
                  "firstName": "Mary",
                  "lastName": "Zheng",
                  "fromCity": "Montgomery Village",
                  "fromState": "Md.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "1605cf4e-1156-4ddf-8ec8-375d2f10160f",
                  "firstName": "Mitch",
                  "lastName": "Guerra",
                  "fromCity": "Waco",
                  "fromState": "Texas",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "c4a2c9cf-5262-4e0a-8290-7481bad624a6",
                  "firstName": "Saiounia",
                  "lastName": "Hughley",
                  "fromCity": "Philadelphia",
                  "fromState": "Pa.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "514ead81-9cdc-41c8-a113-8d84e3132485",
                  "firstName": "Shauhin",
                  "lastName": "Davari",
                  "fromCity": "East Bay",
                  "fromState": "Calif.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "cba37a9b-ea47-42b4-bbc5-366ebce84146",
                  "firstName": "Star",
                  "lastName": "Toomey",
                  "fromCity": null,
                  "fromState": "Monrovia",
                  "fromCountry": "Liberia",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              },
              {
                  "id": "cda3198e-0875-4096-81e6-8a4afb63ebc4",
                  "firstName": "Thomas",
                  "lastName": "Krottinger",
                  "fromCity": "Los Angeles",
                  "fromState": "Calif.",
                  "fromCountry": "US",
                  "nickName": null,
                  "eliminationInfo": {
                      "isEliminated": false,
                      "dayEliminated": null,
                      "placement": null,
                      "episodeEliminated": null
                  }
              }
          ]
      },
      {
          "id": "c5d6e7f8-9a0b-4c9d-b4a8-f1c2d3e4f5a6",
          "description": "Who will win the immunity challenge?",
          "optionType": "tribe",
          "pointValue": 5,
          "options": []
      }
  ],
  "leagueSurveyId": "49498514-3488-4b83-9be8-df48937a7202",
  "leagueId": "713d9caa-eb5f-4b7b-8b01-f5685deadca1",
  "leagueProfileId": "7b2ce21c-cf2c-4399-9300-6ddef183ff9c",
  "submissionStatus": "Not Submitted"
}`;
const surveyoBject: LeagueMemberSurvey = JSON.parse(surveyInfo);

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const account = useSelector((state: RootState) => state.auth.account);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div>
      {account?.userName && isAuthenticated ? (
        <LoggedInHomePage />
      ) : (
        // <NotLoggedInHomePage />
        <Survey survey={surveyoBject} />
      )}
    </div>
  );
};

export default HomePage;

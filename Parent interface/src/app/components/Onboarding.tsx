import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Heart, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  section?: string;
  question: string;
  subtitle: string;
  options?: string[];
  multiSelect?: boolean;
  inputType?: "radio" | "text" | "textarea" | "time";
  placeholder?: string;
}

const questions: Question[] = [
  // Introduction
  {
    id: 0,
    section: "Let's understand your family",
    question: "Welcome!",
    subtitle: "The more we know about your family, the more personalised and helpful your experience will be. This should take about 2 minutes.",
    options: ["Let's begin"],
  },
  
  // Reduced to 10 essential questions
  {
    id: 1,
    section: "About your child",
    question: "How old is your child?",
    subtitle: "This helps us give age-appropriate suggestions",
    options: [
      "7 years old",
      "8 years old",
      "9 years old",
      "10 years old",
      "11 years old",
    ],
  },
  {
    id: 2,
    question: "What are your main goals? Select up to 3",
    subtitle: "We'll focus on what matters most to you",
    options: [
      "Support my child to be more active",
      "Help my child feel happier and more confident",
      "Create more balanced family meals",
      "Encourage my child to eat more variety",
      "Build a better family routine",
      "Support my own health journey too",
    ],
    multiSelect: true,
  },
  {
    id: 3,
    section: "Diet & Culture",
    question: "What does your family's cultural background include?",
    subtitle: "We'll suggest foods and recipes that fit your family (select all that apply)",
    options: [
      "British/Irish",
      "South Asian (Indian, Pakistani, Bangladeshi)",
      "East Asian (Chinese, Japanese, Korean)",
      "African/Caribbean",
      "Middle Eastern",
      "European",
      "Latin American",
      "Other/Mixed",
    ],
    multiSelect: true,
  },
  {
    id: 4,
    question: "Which food groups does your family regularly eat?",
    subtitle: "This helps us suggest recipes you'll actually make (select all that apply)",
    options: [
      "Rice and grains",
      "Pasta and noodles",
      "Potatoes",
      "Chicken",
      "Fish",
      "Lentils and beans",
      "Fresh vegetables",
      "Fresh fruit",
      "Dairy (milk, cheese, yogurt)",
      "Eggs",
    ],
    multiSelect: true,
  },
  {
    id: 5,
    question: "How much time do you usually have for preparing meals?",
    subtitle: "We'll match suggestions to your schedule",
    options: [
      "Under 15 minutes",
      "15-30 minutes",
      "30-45 minutes",
      "45+ minutes when possible",
    ],
  },
  {
    id: 6,
    question: "Any food allergies or dietary requirements?",
    subtitle: "We'll make sure all suggestions are safe and suitable",
    options: [
      "No allergies or restrictions",
      "Dairy allergy/intolerance",
      "Nut allergy",
      "Egg allergy",
      "Gluten intolerance/coeliac",
      "Vegetarian",
      "Halal",
      "Other",
    ],
    multiSelect: true,
  },
  {
    id: 7,
    section: "Activity",
    question: "How active is your child currently?",
    subtitle: "This helps us set realistic, achievable goals",
    options: [
      "Very active - plays sports or very energetic most days",
      "Moderately active - plays outside sometimes",
      "Quite still - prefers screen time or quiet play",
      "It varies a lot day to day",
    ],
  },
  {
    id: 8,
    question: "What space do you have for physical activity?",
    subtitle: "We'll suggest activities that fit your home (select all that apply)",
    options: [
      "Garden or outdoor space",
      "Living room or indoor space",
      "Local park nearby",
      "Community sports facilities",
      "Limited space only",
    ],
    multiSelect: true,
  },
  {
    id: 9,
    question: "What equipment or items do you have at home?",
    subtitle: "We'll tailor movement ideas to what you have (select all that apply)",
    options: [
      "Bike or scooter",
      "Ball (football, basketball, etc.)",
      "Skipping rope",
      "Sports equipment (bat, rackets, etc.)",
      "None - just body movement is fine",
    ],
    multiSelect: true,
  },
  {
    id: 10,
    section: "Final step",
    question: "What would make this easier for you?",
    subtitle: "We're here to support you, not add pressure (select all that apply)",
    options: [
      "Quick, simple meal ideas",
      "One-click grocery lists",
      "Ideas using ingredients I already have",
      "Fun activity suggestions",
      "Support for difficult moments",
      "Budget-friendly options",
    ],
    multiSelect: true,
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const currentSection = currentQuestion.section;
  const isNewSection = currentStep === 0 || (currentSection && currentSection !== questions[currentStep - 1]?.section);

  const handleNext = () => {
    if (isLastStep) {
      // Save onboarding complete status and answers to localStorage
      localStorage.setItem("onboardingComplete", "true");
      localStorage.setItem("onboardingAnswers", JSON.stringify(answers));
      navigate("/home");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSingleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
    // Auto-advance for single-select questions
    if (!currentQuestion.multiSelect && !currentQuestion.inputType) {
      setTimeout(() => {
        handleNext();
      }, 300);
    }
  };

  const handleMultiAnswer = (option: string) => {
    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option];
    setAnswers({ ...answers, [currentQuestion.id]: newAnswers });
  };

  const handleTextInput = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const canProceed = currentQuestion.inputType === "text" || currentQuestion.inputType === "textarea"
    ? true // Always allow proceeding with text input (can be blank)
    : currentQuestion.multiSelect
    ? (answers[currentQuestion.id] as string[])?.length > 0
    : answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-8">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-lg">HealthySteps</span>
          </div>
        </div>

        {/* Section header */}
        {isNewSection && currentSection && (
          <div className="mb-6 text-center">
            <h2 className="text-primary">{currentSection}</h2>
            {currentSection === "Let's understand your family" && (
              <p className="text-sm text-muted-foreground mt-2">
                The more answers, the more personalised the experience
              </p>
            )}
          </div>
        )}

        {/* Progress indicator */}
        <div className="flex gap-1 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <Card className="flex-1 flex flex-col p-6 shadow-sm">
          <div className="flex-1">
            <h1 className="mb-2">{currentQuestion.question}</h1>
            <p className="text-muted-foreground mb-6">
              {currentQuestion.subtitle}
            </p>

            {/* Text input */}
            {currentQuestion.inputType === "text" && (
              <Input
                type="text"
                placeholder={currentQuestion.placeholder}
                value={(answers[currentQuestion.id] as string) || ""}
                onChange={(e) => handleTextInput(e.target.value)}
                className="w-full"
              />
            )}

            {/* Textarea input */}
            {currentQuestion.inputType === "textarea" && (
              <Textarea
                placeholder={currentQuestion.placeholder}
                value={(answers[currentQuestion.id] as string) || ""}
                onChange={(e) => handleTextInput(e.target.value)}
                className="w-full min-h-32"
              />
            )}

            {/* Multi-select checkboxes */}
            {currentQuestion.multiSelect && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isChecked = (
                    (answers[currentQuestion.id] as string[]) || []
                  ).includes(option);
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleMultiAnswer(option)}
                    >
                      <Checkbox
                        checked={isChecked}
                        id={`option-${index}`}
                        onCheckedChange={() => handleMultiAnswer(option)}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Single-select radio buttons */}
            {!currentQuestion.multiSelect && !currentQuestion.inputType && currentQuestion.options && (
              <RadioGroup
                value={answers[currentQuestion.id] as string}
                onValueChange={handleSingleAnswer}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleSingleAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
              >
                Back
              </Button>
            )}
            {(currentQuestion.multiSelect || currentQuestion.inputType) && (
              <Button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex-1"
                size="lg"
              >
                {isLastStep ? "Complete" : "Continue"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        </Card>

        {/* Step indicator */}
        <p className="text-center text-muted-foreground mt-6">
          Question {currentStep + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
}
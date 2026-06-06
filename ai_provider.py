from google import genai
from groq import Groq

import os
from dotenv import load_dotenv

load_dotenv()



# Gemini Client
gemini_client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# Groq Client
groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def call_gemini(prompt):

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


def call_groq(prompt):

    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


def validate_experiment(prompt):

    try:

        print("Using Groq for validation")

        return call_groq(prompt)

    except Exception as e:

        print("Groq failed:", e)
        print("Switching to Gemini")

        try:

            result = call_gemini(prompt)

            print("\n===== GEMINI RESPONSE =====")
            print(result)
            print("===========================\n")

            return result

        except Exception as gemini_error:

            print("\n===== GEMINI ERROR =====")
            print(gemini_error)
            print("========================\n")

            raise


def generate_lab_record(prompt):

    try:

        print("Using Groq for generation")

        return call_groq(prompt)

    except Exception as e:

        print("Groq failed:", e)
        print("Switching to Gemini")

        try:

            result = call_gemini(prompt)

            print("\n===== GEMINI RESPONSE =====")
            print(result)
            print("===========================\n")

            return result

        except Exception as gemini_error:

            print("\n===== GEMINI ERROR =====")
            print(gemini_error)
            print("========================\n")

            raise
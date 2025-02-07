
import whisper
import argparse
import sys
import os

def main():
    parser = argparse.ArgumentParser(description="Transcribe audio to text using Whisper.")
    parser.add_argument("audio_path", help="Path to the audio file.")
    parser.add_argument("output_path", help="Path to save the output text file.")
    parser.add_argument("--model", default="medium", help="Whisper model to use (tiny, base, small, medium, large).")
    #parser.add_argument("--task", type=str, default="transcribe", help="Task to perform: transcribe or translate")
    args = parser.parse_args()

    if not os.path.isfile(args.audio_path):
        print(f"Error: File '{args.audio_path}' not found.", file=sys.stderr)
        sys.exit(1)
    
    try:
        model = whisper.load_model(args.model)
    except Exception as e:
        print(f"Error loading Whisper model: {e}", file=sys.stderr)
        sys.exit(1)

    print("Transcribing audio...")
    result = model.transcribe(args.audio_path, language="en")

    with open(args.output_path, "w", encoding="utf-8") as f:
        f.write(result["text"])
    
    print(f"Transcription saved: {args.output_path}")

if __name__ == "__main__":
    main()
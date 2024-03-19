import json

def convert_time(time_index):
    hours = time_index // 3600
    minutes = (time_index % 3600) // 60
    seconds = time_index % 60
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"

def main():
    with open('timelist.json', 'r') as f:
        timelist = json.load(f)

    video_data = []
    for index, value in enumerate(timelist):
        time = convert_time(index)
        video_data.append({"time": time, "value": value})

    output_data = {"video_data": video_data}

    with open('video_data.json', 'w') as f:
        json.dump(output_data, f, indent=4)

if __name__ == "__main__":
    main()
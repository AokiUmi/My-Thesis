import json

def main():
    points_dict = {}
    point_id = 1
    
    print("Enter point information in the format: id x y (e.g., 1 0 0)")
    print("Press 'end' to finish entering points.")
    
    while True:
        user_input = input().strip()
        
        if user_input.lower() == "end":
            break
        
        try:
            point_info = user_input.split()
            point_id = int(point_info[0])
            x = float(point_info[1])
            y = float(point_info[2])
            points_dict[str(point_id)] = [x, y]
        except (IndexError, ValueError):
            print("Invalid input. Please enter in the format: id x y")
    
    save_points_to_json(points_dict)

def save_points_to_json(points_dict):
    with open('vertices.json', 'w') as f:
        json.dump({"vertices_dict": points_dict}, f)
    print("Points saved to points.json")

if __name__ == "__main__":
    main()
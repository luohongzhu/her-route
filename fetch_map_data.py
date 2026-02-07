import requests
import json

def fetch_mcmaster_map():
    """
    Fetch all roads in McMaster area from OpenStreetMap
    """
    
    # McMaster bounding box (lat, lng)
    # Roughly 2km radius around campus
    min_lat, min_lng = 43.245, -79.935
    max_lat, max_lng = 43.275, -79.900
    
    bbox = f"{min_lat},{min_lng},{max_lat},{max_lng}"
    
    overpass_url = "http://overpass-api.de/api/interpreter"
    
    # Query for roads and paths
    query = f"""
    [out:json][bbox:{bbox}];
    (
      way["highway"]["highway"!="motorway"]["highway"!="motorway_link"];
    );
    out geom;
    """
    
    print("Fetching roads from OpenStreetMap...")
    print(f"Bounding box: {bbox}")
    
    response = requests.post(overpass_url, data={'data': query})
    
    if response.status_code == 200:
        data = response.json()
        
        # Save raw data
        with open('mcmaster_roads.json', 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Fetched {len(data['elements'])} road segments")
        
        # Create simplified version for easier use
        simplified = []
        for element in data['elements']:
            if element.get('geometry'):
                road_data = {
                    'id': element['id'],
                    'name': element.get('tags', {}).get('name', 'Unnamed Road'),
                    'type': element.get('tags', {}).get('highway', 'road'),
                    'coordinates': [[point['lat'], point['lon']] for point in element['geometry']]
                }
                simplified.append(road_data)
        
        with open('roads_simplified.json', 'w') as f:
            json.dump(simplified, f, indent=2)
        
        print(f"✓ Saved simplified data: {len(simplified)} roads")
        
        # Print some sample roads
        print("\nSample roads found:")
        for road in simplified[:10]:
            print(f"  - {road['name']} ({road['type']}, {len(road['coordinates'])} points)")
        
        return simplified
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        return None

if __name__ == "__main__":
    roads = fetch_mcmaster_map()
    
    if roads:
        print(f"\n🎉 Success! Found {len(roads)} roads around McMaster")
        print("Files created: mcmaster_roads.json, roads_simplified.json")
    else:
        print("\n❌ Failed to fetch data")
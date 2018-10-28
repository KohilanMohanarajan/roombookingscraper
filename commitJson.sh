echo "Running room scraper script..."
python3 room_scraper_v2.py

echo "Copying to website..."
cp rooms.json ../mywebsite
cd ../mywebsite 

echo "Pulling from master..."
git pull

echo "Committing to master..."
git add rooms.json
git commit -m "Updated rooms"
git push

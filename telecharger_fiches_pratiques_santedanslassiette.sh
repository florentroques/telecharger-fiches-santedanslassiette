#!/usr/bin/env zsh

url="http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/fiches-pratiques.html"
base_url_page_fiche_pratique="http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/"
base_url_image_fiche_pratique="http://www.lasantedanslassiette.com/images/"

# https://www.google.fr/search?q=site:http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/&tbs=ift:png,isz:lt,islt:qsvga&tbm=isch
# url="https://www.google.fr/search?q=site:http://www.lasantedanslassiette.com/au-menu/medias/fiches-pratiques/&tbs=ift:png,isz:lt,islt:qsvga&tbm=isch"

# https://stackoverflow.com/a/2804721
output_urls_relatives_pages_fiches_pratiques=`
wget -q -O - $url | \
tr "\t\r\n'" '   "' | \
# donne urls complètes
# grep -i -o '<a[^>]\+href[ ]*=[ \t]*"\(ht\|f\)tps\?:[^"]\+"' | \
# donne les urls qui commencent avec "fiche"
grep -i -o '<a[^>]\+href[ ]*=[ \t]*"fiche[^s][^"]\+"' | \
grep -Eo '(fiche[^\"]+)' | \
sort | \
uniq`

# echo $output_urls_relatives_pages_fiches_pratiques

# exit 1

array_urls_absolues_pages_fiches_pratiques=()
while read -r line; do
  array_urls_absolues_pages_fiches_pratiques+=(
    "$base_url_page_fiche_pratique$line"
  );
done <<< "$output_urls_relatives_pages_fiches_pratiques"

# for line in $output_urls_relatives_pages_fiches_pratiques; do
#   array_urls_absolues_pages_fiches_pratiques+=("$base_url_page_fiche_pratique$line")
# done

# echo "${array_urls_absolues_pages_fiches_pratiques[@]}"
# printf '%s\n' "${array_urls_absolues_pages_fiches_pratiques[@]}"
echo "${array_urls_absolues_pages_fiches_pratiques[0]}"

for page_fiche_pratique in "${array_urls_absolues_pages_fiches_pratiques[@]}"; do
  #  if [[ "${my_array[$i]}" = "${value}" ]]; then
  #      echo "${i}";
  #  fi

 # echo "$i"
 wget -q -O - $page_fiche_pratique | \
 tr "\t\r\n'" '   "' | \
 # donne urls complètes
 # grep -i -o '<a[^>]\+href[ ]*=[ \t]*"\(ht\|f\)tps\?:[^"]\+"' | \
 # donne les urls qui commencent avec "fiche"
 grep -i -o '<a[^>]\+href[ ]*=[ \t]*"fiche[^s][^"]\+"' | \
 grep -Eo '(fiche[^\"]+)' | \
 sort | \
 uniq`

done

# wget -q -O - $url

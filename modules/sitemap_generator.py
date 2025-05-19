from flask import url_for, request
import datetime

def generate_sitemap(app):
    """
    Generate a sitemap.xml file for the application
    """
    # Base URL for the sitemap
    base_url = request.url_root.rstrip('/')
    
    # Current date in W3C format
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    
    # Start XML content
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Define pages and their change frequencies
    pages = [
        {'route': 'index', 'changefreq': 'monthly', 'priority': '1.0'},
        {'route': 'bulk', 'changefreq': 'monthly', 'priority': '0.8'},
        {'route': 'decoder', 'changefreq': 'monthly', 'priority': '0.8'},
        {'route': 'api_docs', 'changefreq': 'monthly', 'priority': '0.7'},
        {'route': 'uuidguide', 'changefreq': 'monthly', 'priority': '0.7'},
        {'route': 'developer', 'changefreq': 'monthly', 'priority': '0.7'},
        {'route': 'terms', 'changefreq': 'yearly', 'priority': '0.3'},
        {'route': 'privacy', 'changefreq': 'yearly', 'priority': '0.3'},
        {'route': 'cookies', 'changefreq': 'yearly', 'priority': '0.3'}
    ]
    
    # Create a URL entry for each page
    with app.test_request_context():
        for page in pages:
            try:
                # Generate URL for the page
                page_url = url_for(page['route'], _external=True)
                
                # Add the URL to the sitemap
                xml_content += '  <url>\n'
                xml_content += f'    <loc>{page_url}</loc>\n'
                xml_content += f'    <lastmod>{today}</lastmod>\n'
                xml_content += f'    <changefreq>{page["changefreq"]}</changefreq>\n'
                xml_content += f'    <priority>{page["priority"]}</priority>\n'
                xml_content += '  </url>\n'
            except Exception as e:
                # Skip if the route doesn't exist
                print(f"Error generating sitemap entry for {page['route']}: {e}")
                continue
    
    # End XML content
    xml_content += '</urlset>'
    
    return xml_content 